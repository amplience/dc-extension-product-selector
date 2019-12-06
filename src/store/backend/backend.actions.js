import { getBackend } from "../../backends/backends";
import { setCatalog } from "../catalog/catalog.actions";

export const SET_BACKEND = 'SET_BACKEND';
export const INIT_BACKEND = 'INIT_BACKEND';

export const initBackend = () => async (dispatch, getState) => {
  const { params } = getState();

  dispatch(setBackend(getBackend(params)));

  if (params.backend === 'Hybris') {
    const fallback = [{ id: 'Catalog required' }];

    dispatch(setCatalog((params.catalogs || fallback)[0].id));
  }
};

export const setBackend = value => ({
  type: SET_BACKEND,
  value
});
