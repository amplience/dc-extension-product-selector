import { init } from "dc-extensions-sdk";
import { setParams } from "../params/params.actions";
import { initBackend } from '../backend/backend.actions';
import { getSelectedItems } from '../selectedItems/selectedItems.actions';
import { setFetching } from '../fetching/fetching.actions';
import { setGlobalError } from '../global-error/global-error.actions';

export const SET_SDK = 'SET_SDK';

export const setSDK = value => ({
  type: SET_SDK,
  value
});

export const FETCH_SDK = 'FETCH_SDK';

export const fetchSDK = () => async (dispatch, getState) => {
  let { SDK } = getState();

  if (SDK) {
    return SDK;
  }

  dispatch(setFetching(true));

  try {
    SDK = await init();

    dispatch(setSDK(SDK));
    dispatch(setParams(SDK.params));
    dispatch(initBackend());
    dispatch(getSelectedItems());
    dispatch(setFetching(false));

    SDK.frame.startAutoResizer();
  }
  catch (e) {
    console.error('Failed to load', e);    
    dispatch(setFetching(false));
    dispatch(setGlobalError('Could not get SDK'));
  }


  return SDK;
}