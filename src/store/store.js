import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware, combineReducers } from 'redux';

import { sdkReducer } from './sdk/sdk.reducer';
import { pagesReducer } from './pages/pages.reducer'
import { itemsReducer } from './items/items.reducer';
import { paramReducer } from './params/params.reducer';
import { backendReducer } from './backend/backend.reducer';
import { touchedReducer } from './touched/touched.reducer';
import { catalogReducer } from './catalog/catalog.reducer';
import { fetchingReducer } from './fetching/fetching.reducer';
import { searchTextReducer } from './searchText/searchText.reducer';
import { initialisedReducer } from './initialised/initialised.reducer';
import { selectedItemsReducer } from './selectedItems/selectedItems.reducer';

import { fetchSDK } from './sdk/sdk.actions';

const rootReducer = combineReducers({
  SDK: sdkReducer,
  page: pagesReducer,
  items: itemsReducer,
  params: paramReducer,
  backend: backendReducer,
  touched: touchedReducer,
  isFetching: fetchingReducer,
  searchText: searchTextReducer,
  initialised: initialisedReducer,
  selectedCatalog: catalogReducer,
  selectedItems: selectedItemsReducer,
  PAGE_SIZE: (state = 20) => state,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

store.dispatch(fetchSDK());