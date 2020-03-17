import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';

const useStyles = makeStyles(() => ({
  paper: {
    margin: '21px 0',
    padding: '16px',
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Container>
      <Grid container={true} justify="center" spacing={3}>
        <Grid item={true} xs={6}>
          <Paper className={classes.paper} color="text.primary">
            WebRTC Application
          </Paper>
          <Button variant="contained" color="primary">
            Turn on
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
