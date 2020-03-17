import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { default as VideoCallIcon } from '@material-ui/icons/VideoCall';
import VideoCall from 'containers/VideoCall';
import * as React from 'react';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <VideoCallIcon />
          </IconButton>
          <Typography variant="h5">WebRTC Sample</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <VideoCall />
      </Container>
    </div>
  );
}

export default App;
