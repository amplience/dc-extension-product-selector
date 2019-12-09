import { getBackend } from "../../backends/backends";
import { setCatalog } from "../catalog/catalog.actions";
import { Hybris } from "../../backends/Hybris";

export const SET_BACKEND = 'SET_BACKEND';
export const INIT_BACKEND = 'INIT_BACKEND';

export const initBackend = () => async (dispatch, getState) => {
  const { params } = getState();

  dispatch(setBackend(getBackend(params)));

  if (params.backend === 'Hybris') {
    dispatch(setCatalog(Hybris.getDefaultCatalog(params)));
  }
};

export const setBackend = value => ({
  type: SET_BACKEND,
  value
});
