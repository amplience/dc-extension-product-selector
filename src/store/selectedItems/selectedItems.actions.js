import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import isArray from 'lodash/isArray';

import { setValue } from '../items/items.actions';
import { setFetching } from '../fetching/fetching.actions';
import { setInitialised } from '../initialised/initialised.actions';
import { ProductSelectorError } from '../../ProductSelectorError';
import { setTouched } from '../touched/touched.actions';
import { setGlobalError } from '../global-error/global-error.actions';

export const GET_SELECTED_ITEMS = 'GET_SELECTED_ITEMS';
export const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';
export const REMOVE_SELECTED_ITEM = 'REMOVE_SELECTED_ITEM';
export const ADD_SELECTED_ITEM = 'ADD_SELECTED_ITEM';
export const REORDER_SELECTED_ITEMS = 'REORDER_SELECTED_ITEM';

export const addItem = item => ({
  type: ADD_SELECTED_ITEM,
  value: item
});

export const removeItem = item => ({
  type: REMOVE_SELECTED_ITEM,
  value: item
});

export const setSelectedItems = value => ({
  type: SET_SELECTED_ITEMS,
  value
});

export const reorder = indexes => ({
  type: REORDER_SELECTED_ITEMS,
  value: indexes
});

export const toggleProduct = (item, isSelected) => async (dispatch, getState) => {
  dispatch(isSelected ? removeItem(item) : addItem(item));
  dispatch(setTouched(true));

  const { selectedItems } = getState();

  dispatch(setValue(selectedItems));
};

export const reorderItems = indexes => (dispatch, getState) => {
  dispatch(reorder(indexes));
  const { selectedItems } = getState();
  dispatch(setValue(selectedItems));
};

export const getSelectedItems = () => async (dispatch, getState) => {
  const state = getState();
  const { SDK, backend } = state;

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

    if (filteredIds && filteredIds.length) {
      const items = await backend.getItems(state, filteredIds);

      if (!isArray(items)) {
        throw new ProductSelectorError('Field value is not an array', ProductSelectorError.codes.INVALID_VALUE);
      }

      selectedItems = items;
    }

    selectedItems = sortBy(selectedItems, ({ id }) => indexOf(ids, id));

    if (selectedItems.length !== ids.length) {
      dispatch(setValue(selectedItems));
    }

    dispatch(setSelectedItems(selectedItems));
    dispatch(setFetching(false));
    dispatch(setInitialised(true));
  } catch (e) {
    console.error('could not load', e);
    dispatch(setFetching(false));
    dispatch(setInitialised(true));
    dispatch(setGlobalError('Could not get selected items'));
  }
};
