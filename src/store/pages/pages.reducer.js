import { SET_PAGE } from "./pages.actions";

const initalState = {
  numPages: 0,
  curPage: 0,
  total: 0
};

export function pagesReducer(state = initalState, action) {
  switch (action.type) {
    case SET_PAGE:
      return {...state, ...action.value};
    default:
      return state;
  }
}