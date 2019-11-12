import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
// import { SET_FETCHING, SET_PARAMS, SET_SDK, SET_SELECTED_ITEMS } from './actions';

import creds from './creds';
import { CastForEducationSharp } from '@material-ui/icons';

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
  items: [],
  SDK: null
}; 

function appState(state = initialState, action) {
  if (action.key) {
    return {...state, [action.key]: action.value};
  }
  switch (action.type) {
    default:
      return state;
  }
}



export const store = createStore(appState, applyMiddleware(thunkMiddleware));