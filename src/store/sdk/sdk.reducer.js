import { SET_SDK } from "./sdk.actions";

export function sdkReducer(state = null, action) {
  switch(action.type) {
    case SET_SDK:
      return action.value;
    default:
      return state;
  }
}