import { toLower } from 'lodash';
import { SET_PARAMS } from "./params.actions";

const params = {
  proxyUrl: '',
  sfccUrl: '',
  authSecret: '',
  authClientId: '',
  siteId: '',
  catalogs: [],
  backend: 'SFCC',
  noItemsText: 'No items selected.',
  searchPlaceholderText: 'Search'
};

export function paramReducer(state = params, {type, value}) {
  switch (type) {
    case SET_PARAMS:
      const {installation, instance} = (value || {});
      const selectedParams = {...installation, ...instance};
      return {...state, ...selectedParams, backend: toLower(selectedParams.backend)};
    default:
      return state;
  }
}