import { SET_BACKEND } from "./backend.actions";

export function backendReducer(state = {}, action) {
  switch (action.type) {
    case SET_BACKEND:
      return action.value;
    default:
      return state;
  }
}
