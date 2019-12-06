import { SET_CATALOG } from "./catalog.actions";

export function catalogReducer(state = 'all', action) {
  switch (action.type) {
    case SET_CATALOG:
      return action.value;
    default:
      return state;
  }
}