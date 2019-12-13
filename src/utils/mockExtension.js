import React from 'react';

import { theme } from '../theme';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core';

const initalParams  = {
  proxyUrl: '',
  sfccUrl: '',
  authSecret: '',
  authClientId: '',
  siteId: '',
  catalogs: [],
  backend: 'SFCC',
  noItemsText: 'No items selected.',
  searchPlaceholderText: 'Search'
};

export const extension = ({ params = initalParams, initalValue = [] } = {}) => {
  const onReadOnlyChange = jest.fn();
  const startAutoResizer = jest.fn();
  const getValue = jest.fn(() => initalValue);
  const setValue = jest.fn();

  const extension = {
    params: {
      instance: params
    },
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
    },

  };

  const mock = () => {
  
    jest.doMock('dc-extensions-sdk', () => ({
      init: jest.fn(() => Promise.resolve(extension))
    }));

    const { store, rootReducer } = require('../store/store');

    return { rootReducer, store };

  };


  return { extension, mock };
}
export const mockExtension = ({ params = initalParams, initalValue = [] } = {}) => {
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

  const { store, rootReducer } = require('../store/store');

  return { extension, store, rootReducer }
}

export async function mockExtensionWrapper({ params = initalParams, initalValue = [] } = {}) {
  const { extension, store, rootReducer } = mockExtension({ params, initalValue });
  const { fetchSDK } = require('../store/sdk/sdk.actions');

  store.dispatch(fetchSDK());

  const Render = ({ children }) => (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </Provider>
  );

  return {
    Render,
    store,
    rootReducer,
    ...extension
  };
}
