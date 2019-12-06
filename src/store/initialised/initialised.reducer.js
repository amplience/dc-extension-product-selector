import { SET_INITIALISED } from "./initialised.actions";

export function initialisedReducer(state = false, action) {
  switch (action.type) {
    case SET_INITIALISED:
      return action.value;
    default:
      return state;
  }
}