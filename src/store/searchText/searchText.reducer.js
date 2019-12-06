import { SET_SEARCH_TEXT } from "./searchText.actions";

export function searchTextReducer(state = '', action) {
  switch (action.type) {
    case SET_SEARCH_TEXT:
      return action.value;
    default:
      return state;
  }
}