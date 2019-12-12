import React from 'react';
import { Provider } from 'react-redux';


const initalParams = {
  instance: {},
  installation: {}
};

export async function mockExtension({ params = initalParams, initalValue = [] } = {}) {
  const onReadOnlyChange = jest.fn();
  const startAutoResizer = jest.fn();
  const getValue = jest.fn(() => initalValue);
  const setValue = jest.fn();

  const extension = {
    params,
    form: {
      onReadOnlyChange
    },
    frame: {
      startAutoResizer
    },
    field: {
      getValue,
      setValue,
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  };

  jest.doMock('dc-extensions-sdk', () => ({
    init: jest.fn(() => Promise.resolve(extension))
  }));

  const App = require('../App').default;
  const { store } = require('../store/store');

  const Render = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );

  return {
    App: Render,
    ...extension
  };
}