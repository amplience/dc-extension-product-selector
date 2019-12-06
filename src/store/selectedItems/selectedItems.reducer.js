import { SET_SELECTED_ITEMS } from './selectedItems.actions';

export function selectedItemsReducer(state = [], action) {
  switch (action.type) {
    case SET_SELECTED_ITEMS:
      return action.value;
    default:
      return state;
  }
}
