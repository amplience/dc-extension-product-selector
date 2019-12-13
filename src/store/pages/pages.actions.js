import { getItems } from "../items/items.actions";

export const SET_PAGE = 'SET_PAGE';
export const setPage = value => ({
  type: SET_PAGE,
  value
});

export const changePage = curPage => async (dispatch, getState) => {
  const { page } = getState();
  dispatch(setPage({...page, curPage }));
  dispatch(getItems());
}

