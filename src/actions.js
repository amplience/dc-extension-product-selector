import { init } from 'dc-extensions-sdk';

export const SUCCESS = 'SUCCESS';
export const ERROR = 'ERROR'; 

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
export const setParams = value => ({
  type: SET_PARAMS,
  key: 'params',
  value
});


export const SET_SDK = 'SET_SDK';
export const setSDK = (value, status) => ({
  type: SET_SDK,
  key: 'SDK',
  value,
  status
});

export const fetchSDK = () => async (dispatch, getState) => {
  const state = getState();
  if (state.SDK) {
    Promise.resolve(state.SDK);
  }

  dispatch(setFetching(true));

  let SDK = null;
  try {
    SDK = await init();
    dispatch(setSDK(SDK, SUCCESS));
    dispatch(setFetching(false));
    dispatch(getSelectedItems());
    dispatch(setParams(SDK.params));
  } catch (e) {
    dispatch(setSDK(null, ERROR));
  }
  dispatch(setFetching(false));
  return Promise.resolve(SDK);
};

export const GET_SELECTED_ITEMS = 'GET_SELECTED_ITEMS';
export const getSelectedItems = () => async (dispatch, state) => {
  dispatch(setFetching(true));
  let selectedItems = [];
  let status = SUCCESS;
  try {
    selectedItems = await state().SDK.getValue();
  } catch (e) {
    status = ERROR;
  }
  dispatch(selectedItems(selectedItems, status));
  dispatch(setFetching(false));
  return Promise.resolve(selectedItems);
};

export const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';
export const setSelectedItems = value => ({
  type: SET_SELECTED_ITEMS,
  key: 'selectedItems',
  value
});

export const GET_ITEMS = 'GET_ITEMS';
export const getItems = searchText => async (dispatch, state) => {
  if (!searchText.length) {
    return Promise.resolve([]);
  }
  dispatch(setFetching(true));
  let items = [];
  let status = SUCCESS;
  let {params: {url, clientId}} = state();
  try {
    const response = await fetch(url + `product_search/images?q=${searchText}&client_id=${clientId}`);
    const {hits} = await response.json();

    if (hits) {
      items = hits.map(hit => ({
        id: hit.product_id, 
        name: hit.product_name,
        image: hit.image.link
      }));
    }
  } catch (e) {
    status = ERROR;
  }
  dispatch(setItems(items, status));
  dispatch(setFetching(false));
  return Promise.resolve(items);
};

export const SET_ITEMS = 'SET_ITEMS';
export const setItems = (value, status) => ({
  type: SET_ITEMS,
  key: 'items',
  value,
  status
});