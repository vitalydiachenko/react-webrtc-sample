import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

const useStyles = makeStyles({
  callContainer: {
    padding: '16px',
  },
  main: {
    margin: '16px 0',
  },
  titles: {
    margin: '32px 0 16px',
  },
});

function VideoCall() {
  const classes = useStyles();

  return (
    <div>
      <Grid container={true} spacing={2}>
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
        <Grid item={true} xs={12} md={4} lg={2}>
          <Button variant="contained" color="primary">
            Open Contacts
          </Button>
        </Grid>
        <Grid item={true} xs={12} md={8} lg={10}>
          <Paper className={classes.callContainer} elevation={3}>
            Video Call Block
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default VideoCall;
