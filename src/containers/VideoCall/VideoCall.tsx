import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import UsersList from 'components/UsersList';
import VideoPreview from 'containers/VideoPreview';
import { useCallDispatcher } from 'hooks';
import * as React from 'react';
import { useState } from 'react';

const useStyles = makeStyles(theme => ({
  callContainer: {
    margin: '16px 0',
    padding: '16px',
  },
  callHeader: {
    padding: '16px',
  },
  main: {
    margin: '32px 0',
  },
  sideBar: {
    [theme.breakpoints.between('xs', 'md')]: {
      margin: '0 0 24px',
    },
  },
  titles: {
    margin: '64px 0 32px',
  },
}));

function VideoCall() {
  const [isUsersListOpen, toggleUsersListVisibility] = useState<boolean>(false);

  const {
    callUser,
    peerConnection,
    setActiveUser,
    state: { activeUser, users },
  } = useCallDispatcher();

  const handleUsersListClose = () => {
    toggleUsersListVisibility(false);
  };

  const handleUsersListOpen = () => {
    toggleUsersListVisibility(true);
  };

  const handleSelectUser = (user: string) => {
    callUser(user).catch(() => {
      throw new Error(`Cannot call user #${user}!`);
    });

    handleUsersListClose();
  };

  const unsetActiveUser = (): void => {
    setActiveUser('');
  };

  const classes = useStyles();

  const callHeaderTitle = !!activeUser ? `Call with user "#${activeUser}"` : 'Start Call';

  return (
    <div>
      <Grid container={true}>
        <Grid className={classes.titles} item={true} xs={12}>
          <Typography align="left" variant="h1" color="textPrimary">
            Video Call
          </Typography>
          <Typography align="left" variant="h4" color="textSecondary">
            WebRTC Driven Sample
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container={true} className={classes.main}>
        <Grid item={true} className={classes.sideBar} xs={12} md={2}>
          <Button variant="contained" color="primary" onClick={handleUsersListOpen}>
            Open Contacts
          </Button>
        </Grid>
        <Grid item={true} xs={12} md={10}>
          <Paper className={classes.callHeader} elevation={3}>
            <Typography noWrap={true} variant="h4" title={callHeaderTitle}>
              {callHeaderTitle}
            </Typography>
          </Paper>
          {!activeUser && (
            <Paper className={classes.callContainer} elevation={1}>
              <Typography variant="body2">
                Open contacts and select user you want to call
              </Typography>
            </Paper>
          )}
          <Paper className={classes.callContainer} elevation={1}>
            <VideoPreview peerConnection={peerConnection} unsetActiveUser={unsetActiveUser} />
          </Paper>
        </Grid>
      </Grid>
      <Drawer open={isUsersListOpen} anchor="left" onClose={handleUsersListClose}>
        <UsersList onSelect={handleSelectUser} users={users} />
      </Drawer>
    </div>
  );
}

export default VideoCall;
