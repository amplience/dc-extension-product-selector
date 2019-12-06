import { SET_TOUCHED } from "./touched.actions";

export function touchedReducer(state = false, action) {
  switch (action.type) {
    case SET_TOUCHED:
      return action.value;
    default:
      return state;
  }
}