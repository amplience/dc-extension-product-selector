import { init } from 'dc-extensions-sdk'; 
import { isArray } from 'lodash';
import { ProductSelectorError } from './ProductSelectorError';

export const SET_FETCHING = 'SET_FETCHING';
export const setFetching = value => ({
  type: SET_FETCHING,
  key: 'isFetching',
  value
});

// export const GET_PARAMS = 'GET_PARAMS';
// export const getParams = value => ({
//   type: GET_PARAMS,

// });


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
  const {SDK} = getState();
  dispatch(setFetching(true));
  let selectedItems = [];
  try {
    if (SDK.field.type !== 'array' || SDK.field.items.type !== 'string') {
      throw new ProductSelectorError('This UI extension only works with "list of text" properties', ProductSelectorError.codes.INVALID_FIELD);
    }
    selectedItems = await SDK.field.getValue();
    if(!isArray(selectedItems)) {
      throw new ProductSelectorError('Field value is not an array', ProductSelectorError.codes.INVALID_VALUE);
    }
  } catch (e) {
    // @TODO snackbar or something... dispatch(error);
  }
  dispatch(setSelectedItems(selectedItems));
  dispatch(setFetching(false));
  return Promise.resolve(selectedItems);
};

export const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';
export const setSelectedItems = value => async (dispatch, getState) => {
  const {SDK} = getState();
  await SDK.field.setValue(value);
  Promise.resolve({
    type: SET_SELECTED_ITEMS,
    key: 'selectedItems',
    value
  });
};

export const GET_ITEMS = 'GET_ITEMS';
export const getItems = () => async (dispatch, getState) => {
  const {params: {url, clientId}, searchText, PAGE_SIZE, page, selectedCategory} = getState();
  if (!searchText.length) {
    return Promise.resolve([]);
  }
  dispatch(setFetching(true));
  let items = [];
  try {
    const start = PAGE_SIZE * page.curPage;
    const categoryId = selectedCategory === 'all' ? '' : `&refine_1=cgid=${selectedCategory}`;
    const response = await fetch(url + `product_search/images?q=${searchText}&client_id=${clientId}&count=${PAGE_SIZE}&start=${start}${categoryId}`);
    const {hits, total} = await response.json(); 
    const numPages = Math.ceil(total / PAGE_SIZE);
    dispatch(setPage({numPages, curPage: page.curPage, total}));

    if (hits) {
      items = hits.map(hit => ({
        id: hit.product_id, 
        name: hit.product_name,
        image: hit.image.link
      }));
    }
  } catch (e) {
    // @TODO - dispatch an error...
  }
  dispatch(setItems(items));
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

export const SET_CATEGORY = 'SET_CATEGORY';
export const setCategory = value => ({
  type: SET_CATEGORY,
  key: 'selectedCategory',
  value
});