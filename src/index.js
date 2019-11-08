import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { store } from './state';
// import { fetchSDK } from './actions'
import { Provider } from 'react-redux';

// store.dispatch(fetchSDK());
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
