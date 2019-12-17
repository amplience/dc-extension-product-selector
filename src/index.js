import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';

import { store } from './store/store';
import { theme } from './theme';
import { Provider } from 'react-redux';
import { fetchSDK } from './store/sdk/sdk.actions';
import { MuiThemeProvider } from '@material-ui/core';

import App from './App';

import './index.scss';

store.dispatch(fetchSDK());

const Render = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(<Render />, document.getElementById('root'));
