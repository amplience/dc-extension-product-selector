import { SET_GLOBAL_ERROR } from './global-error.actions';

export function globalErrorReducer(state = null, action) {
  switch (action.type) {
    case SET_GLOBAL_ERROR:
      return action.value;
    default:
      return state;
  }
}