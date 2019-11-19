import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { SET_PAGE } from './actions';

import creds from './creds';

const initialState = {
  isFetching: false,
  params: {
    url: creds.url,
    clientId: creds.clientId,
    authSecret: creds.authSecret,
    authUrl: creds.authUrl,
    authClientId: creds.authClientId,
    siteId: creds.siteId
  },
  authToken: '',
  selectedItems: [],
  searchText: '',
  items: [],
  SDK: null,
  page: {
    numPages: 0,
    curPage: 0
  },
  PAGE_SIZE: 20,
  backEnd : {}
}; 

const appState = (state = initialState, action) => {
  if (action.key) {
    return {...state, [action.key]: action.value};
  }
  switch (action.type) {
    default:
      return state;
  }
}



export const store = createStore(appState, applyMiddleware(thunkMiddleware));