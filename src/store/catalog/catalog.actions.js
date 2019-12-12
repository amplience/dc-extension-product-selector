import { changePage } from "../pages/pages.actions";

export const SET_CATALOG = 'SET_CATALOG';

export const setCatalog = value => ({
  type: SET_CATALOG,
  value
});

export const changeCatalog = value => async dispatch => {
  dispatch(setCatalog(value));
  dispatch(changePage(0));
}