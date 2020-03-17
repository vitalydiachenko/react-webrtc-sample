import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import UsersList from 'components/UsersList';
import { useSocket } from 'hooks';
import * as React from 'react';
import { useState } from 'react';

const useStyles = makeStyles(theme => ({
  callContainer: {
    padding: '16px',
  },
  main: {
    margin: '32px 0',
  },
  sideBar: {
    [theme.breakpoints.only('xs')]: {
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
    state: { users },
  } = useSocket();

  const handleUsersListClose = () => {
    toggleUsersListVisibility(false);
  };

  const handleUsersListOpen = () => {
    toggleUsersListVisibility(true);
  };

  const classes = useStyles();

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
          <Paper className={classes.callContainer} elevation={3}>
            Video Call Block
          </Paper>
        </Grid>
      </Grid>
      <Drawer open={isUsersListOpen} anchor="left" onClose={handleUsersListClose}>
        <UsersList users={users} />
      </Drawer>
    </div>
  );
}

export default VideoCall;
