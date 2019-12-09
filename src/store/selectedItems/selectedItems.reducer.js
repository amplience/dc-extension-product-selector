import reject from 'lodash/reject';
import filter from 'lodash/filter';
import slice from 'lodash/slice';

import {
  SET_SELECTED_ITEMS,
  REMOVE_SELECTED_ITEM,
  ADD_SELECTED_ITEM,
  REORDER_SELECTED_ITEMS
} from './selectedItems.actions';

export function selectedItemsReducer(state = [], action) {
  switch (action.type) {
    case SET_SELECTED_ITEMS:
      return action.value;
    case REMOVE_SELECTED_ITEM:
      return filter(reject(state, { id: action.value.id }));
    case ADD_SELECTED_ITEM:
      return [...state, action.value];
    case REORDER_SELECTED_ITEMS:
      const { oldIndex, newIndex } = action.value;
      const itemToMove = state[oldIndex];
      const remainingItems = filter(reject(state, { id: itemToMove.id }));
      const reorderedItems = [...slice(remainingItems, 0, newIndex), itemToMove, ...slice(remainingItems, newIndex)];

      return reorderedItems;
    default:
      return state;
  }
}
