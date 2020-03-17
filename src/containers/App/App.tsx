import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import styled from '@material-ui/core/styles/styled';
import * as React from 'react';

const StyledPaper = styled(Paper)({
  margin: '21px 0',
  padding: '16px',
});

class App extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <Container>
        <Grid container={true} justify="center" spacing={3}>
          <Grid item={true} xs={6}>
            <StyledPaper color="text.primary">WebRTC Application</StyledPaper>
            <Button variant="contained" color="primary">
              Turn on
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default App;
