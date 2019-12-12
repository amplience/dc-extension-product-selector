import { SET_FETCHING } from "./fetching.actions";

export function fetchingReducer(state = false, action) {
  switch (action.type) {
    case SET_FETCHING:
      return action.value;
    default:
      return state;
  }
}