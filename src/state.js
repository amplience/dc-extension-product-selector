import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { SET_PARAMS } from './actions';

const initialState = {
  isFetching: false,
  params: {
    url: '',
    clientId: '',
    authSecret: '',
    authUrl: '',
    authClientId: '',
    siteId: '',
    categories: []
  },
  authToken: '',
  selectedItems: [],
  searchText: '',
  items: [],
  SDK: null,
  page: {
    numPages: 0,
    curPage: 0,
    total: 0
  },
  PAGE_SIZE: 20,
  selectedCategory: 'all',
  backEnd : {}
}; 

const setParams = ({installation, instance}, state) => ({...state, params: {...state.params, ...installation, ...instance}});

const appState = (state = initialState, action) => {
  if (action.key) {
    return {...state, [action.key]: action.value};
  }
  switch (action.type) {
    case SET_PARAMS:
      return setParams(action.params, state);
    default:
      return state;
  }
}



export const store = createStore(appState, applyMiddleware(thunkMiddleware));