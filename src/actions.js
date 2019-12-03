import { init } from 'dc-extensions-sdk'; 
import { isArray, map, get } from 'lodash';
import { ProductSelectorError } from './ProductSelectorError';
import { getBackend } from './backends/backends';

export const SET_FETCHING = 'SET_FETCHING';
export const setFetching = value => ({
  type: SET_FETCHING,
  key: 'isFetching',
  value
});

export const  SET_PARAMS = 'SET_PARAMS';
export const setParams = params => ({
  type: SET_PARAMS,
  params
});

export const SET_SDK = 'SET_SDK';
export const setSDK = value => ({
  type: SET_SDK,
  key: 'SDK',
  value
});

export const FETCH_SDK = 'FETCH_SDK';
export const fetchSDK = () => async (dispatch, getState) => {
  const state = getState();
  if (state.SDK) {
    Promise.resolve(state.SDK);
  }

  dispatch(setFetching(true));

  let SDK = null;
  try {
    SDK = await init();
    dispatch(setSDK(SDK));
    dispatch(setParams(SDK.params));
    dispatch(initBackend());
    dispatch(getSelectedItems());
    dispatch(setFetching(false));
    SDK.frame.startAutoResizer();
  } catch (e) {
    // @TODO dispatch an error instead
    // dispatch(setSDK(null, ERROR));

  }
  dispatch(setFetching(false));
  return Promise.resolve(SDK);
};

export const GET_SELECTED_ITEMS = 'GET_SELECTED_ITEMS';
export const getSelectedItems = () => async (dispatch, getState) => {
  const state = getState();
  const {SDK, backend} = state;
  dispatch(setFetching(true));
  let selectedItems = [];

  try {
    if (get(SDK, 'field.schema.type') !== 'array' || get(SDK, 'field.schema.items.type') !== 'string') {
      throw new ProductSelectorError('This UI extension only works with "list of text" properties', ProductSelectorError.codes.INVALID_FIELD);
    }
    const ids = await SDK.field.getValue();
    selectedItems = await backend.getItems(state, ids);
    if(!isArray(selectedItems)) {
      throw new ProductSelectorError('Field value is not an array', ProductSelectorError.codes.INVALID_VALUE);
    }
  } catch (e) {
    // @TODO snackbar or something... dispatch(error);
    console.log('could not load', e);
  }
  dispatch(setSelectedItems(selectedItems));
  dispatch(setFetching(false));
  return Promise.resolve(selectedItems);
};

export const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';
export const setSelectedItems = value => ({
  type: SET_SELECTED_ITEMS,
  key: 'selectedItems',
  value
});

export const SET_VALUE = 'SET_VALUE';
export const setValue = selectedItems => async (dispatch, getState) => {
  const {SDK} = getState();
  await SDK.field.setValue(map(selectedItems, 'id'));
  return Promise.resolve(selectedItems);
};

export const GET_ITEMS = 'GET_ITEMS';
export const getItems = () => async (dispatch, getState) => {
  const state = getState();
  if (!state.searchText.length) {
    return Promise.resolve([]);
  }
  dispatch(setFetching(true));
  let items = [];
  try {
    const {items: fetchedItems, page} = await state.backend.search(state);
    items = fetchedItems;
    console.log(page);
    dispatch(setPage(page));
    dispatch(setItems(items));
  } catch (e) {
    // @TODO - dispatch an error...
  }
  dispatch(setFetching(false));
  return Promise.resolve(items);
};

export const SET_ITEMS = 'SET_ITEMS';
export const setItems = value => ({
  type: SET_ITEMS,
  key: 'items',
  value
});

export const SET_PAGE = 'SET_PAGE';
export const setPage = value => ({
  type: SET_PAGE,
  key: 'page',
  value
});

export const CHANGE_PAGE = 'CHANGE_PAGE';
export const changePage = curPage => async (dispatch, getState) => {
  const {page} = getState();
  dispatch(setPage({...page, curPage}));
  dispatch(getItems());
  return Promise.resolve(page);
};

export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';
export const setSearchText = value => ({
  type: SET_SEARCH_TEXT,
  key: 'searchText',
  value
});

export const SET_CATALOG = 'SET_CATALOG';
export const SET_CATALOG_RESET = 'SET_CATALOG_RESET';
export const setCatalogValue = value => ({
  type: SET_CATALOG,
  key: 'selectedCatalog',
  value
})
export const setCatalog = value => {
  return async dispatch => {
    dispatch(setCatalogValue(value));
    dispatch(setPage(0));
  }
}

export const initBackend = () => async (dispatch, getState) => {
  const {params} = getState();
  dispatch(setBackend(getBackend(params)));
  return Promise.resolve(true);
} 

export const SET_BACKEND = 'SET_BACKEND';
export const setBackend = value => ({
  type: SET_BACKEND,
  key: 'backend',
  value
});

export const SET_TOUCHED = 'SET_TOUCHED';
export const setTouched = value => ({
  type: SET_TOUCHED,
  key: 'touched',
  value
})