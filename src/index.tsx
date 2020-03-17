import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from 'containers/App';
import * as React from 'react';
import { render } from 'react-dom';
import theme from 'styles/theme';

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
