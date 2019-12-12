import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';

import { store } from './store/store';
import { Provider } from 'react-redux';

import App from './App';

import './index.scss';

const Render = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Render/>, document.getElementById('root'));
