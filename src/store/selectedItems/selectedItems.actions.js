import { isArray, get, filter, sortBy, indexOf } from 'lodash';

import { setValue } from '../items/items.actions';
import { setFetching } from '../fetching/fetching.actions'
import { setInitialised } from '../initialised/initialised.actions';
import { ProductSelectorError } from './ProductSelectorError';

export const GET_SELECTED_ITEMS = 'GET_SELECTED_ITEMS';
export const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';

export const getSelectedItems = () => async (dispatch, getState) => {
  const state = getState();
  const {SDK, backend} = state;

  dispatch(setFetching(true));

  let selectedItems = [];

  try {
    if (get(SDK, 'field.schema.type') !== 'array' || get(SDK, 'field.schema.items.type') !== 'string') {
      throw new ProductSelectorError(
        'This UI extension only works with "list of text" properties',
        ProductSelectorError.codes.INVALID_FIELD
      );
    }
    const ids = await SDK.field.getValue();
    const filteredIds = filter(ids);

    if (filteredIds.length) {
      selectedItems = await backend.getItems(state, filteredIds);
    }

    if (!isArray(selectedItems)) {
      throw new ProductSelectorError('Field value is not an array', ProductSelectorError.codes.INVALID_VALUE);
    }

    selectedItems = sortBy(selectedItems, ({id}) => indexOf(ids, id));

    if (selectedItems.length !== ids.length) {
      dispatch(setValue(selectedItems));
    }

  } catch (e) {
    console.log('could not load', e);
  }
  dispatch(setSelectedItems(selectedItems));
  dispatch(setFetching(false));
  dispatch(setInitialised(true));
};

export const setSelectedItems = value => ({
  type: SET_SELECTED_ITEMS,
  value
});
