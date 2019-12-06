import { SET_ITEMS } from "./items.actions";

export function itemsReducer(state = [], action) {
  switch (action.type) {
    case SET_ITEMS:
      return action.value;
      
    default:
      return state;
  }
}