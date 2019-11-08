import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
// import { SET_FETCHING, SET_PARAMS, SET_SDK, SET_SELECTED_ITEMS } from './actions';

const initialState = {
  isFetching: true,
  params: {},
  selectedItems: [],
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