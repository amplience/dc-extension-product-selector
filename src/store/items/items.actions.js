import { map } from 'lodash';
import { setPage } from "../pages/pages.actions";
import { setFetching } from "../fetching/fetching.actions";

export const SET_VALUE = 'SET_VALUE';

export const setValue = selectedItems => async (_, getState) => {
  const {SDK, backend} = getState();

  await SDK.field.setValue(map(selectedItems, backend.getId));
}

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
    dispatch(setPage(page));
    dispatch(setItems(items));
  }
  catch (e) {}

  dispatch(setFetching(false));
}

export const SET_ITEMS = 'SET_ITEMS';

export const setItems = value => ({
  type: SET_ITEMS,
  value
});
