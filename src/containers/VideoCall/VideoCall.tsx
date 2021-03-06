import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { default as CloseIcon } from '@material-ui/icons/Close';
import UsersList from 'components/UsersList';
import VideoPreview from 'containers/VideoPreview';
import { useCallDispatcher } from 'hooks';
import * as React from 'react';
import { useCallback, useState } from 'react';

const useStyles = makeStyles(theme => ({
  callContainer: {
    margin: '16px 0',
    padding: '16px',
  },
  callHeader: {
    padding: '16px',
  },
  currentId: {
    marginTop: '16px',
    padding: '8px',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
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

  const [showExistingCall, setExistingCallStatus] = useState<boolean>(false);

  const {
    callUser,
    endCall,
    setLocalVideoNode,
    setRemoteVideoNode,
    state: {
      activeUser,
      currentId,
      localStream,
      localVideoNode,
      remoteStream,
      remoteVideoNode,
      users,
    },
  } = useCallDispatcher();

  const handleUsersListClose = useCallback(() => {
    toggleUsersListVisibility(false);
  }, []);

  const handleUsersListOpen = useCallback(() => {
    toggleUsersListVisibility(true);
  }, []);

  const handleSelectUser = useCallback<(user: string) => void>(
    (user: string) => {
      if (!activeUser) {
        callUser(user).catch(error => {
          // tslint:disable-next-line:no-console
          console.error(error);

          throw new Error(`Cannot call user #${user}!`);
        });

        handleUsersListClose();
      } else {
        setExistingCallStatus(true);
      }
    },
    [activeUser, callUser, handleUsersListClose],
  );

  const handleEndCall = useCallback(() => {
    endCall(activeUser);
  }, [endCall, activeUser]);

  const handleExistingCallNotificationClose = useCallback(() => {
    setExistingCallStatus(false);
  }, [setExistingCallStatus]);

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
          {!!currentId && (
            <Paper className={classes.currentId} elevation={2}>
              <Typography noWrap={true} variant="h5" title={callHeaderTitle}>
                Your ID: "{currentId}"
              </Typography>
            </Paper>
          )}
          {!activeUser && (
            <Paper className={classes.callContainer} elevation={1}>
              <Typography variant="body2">
                Open contacts and select user you want to call
              </Typography>
            </Paper>
          )}
          <Paper className={classes.callContainer} elevation={1}>
            <VideoPreview
              callingMode={!!activeUser}
              localStream={localStream}
              localVideoNode={localVideoNode}
              onEndCall={handleEndCall}
              remoteStream={remoteStream}
              remoteVideoNode={remoteVideoNode}
              setLocalVideoNode={setLocalVideoNode}
              setRemoteVideoNode={setRemoteVideoNode}
            />
          </Paper>
        </Grid>
      </Grid>
      <Drawer open={isUsersListOpen} anchor="left" onClose={handleUsersListClose}>
        <div className={classes.drawerHeader}>
          <Button variant="contained" color="primary" onClick={handleUsersListClose}>
            <CloseIcon />
          </Button>
        </div>
        <UsersList onSelect={handleSelectUser} users={users} />
      </Drawer>
      <Snackbar
        open={showExistingCall}
        autoHideDuration={3000}
        message="You have existing call! End it to make another!"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handleExistingCallNotificationClose}
      />
    </div>
  );
}

export default VideoCall;
