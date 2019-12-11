import { SET_PARAMS } from './params.actions';

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

export function paramReducer(state = params, action) {
  switch (action.type) {
    case SET_PARAMS:
      const sdkParams = Object.assign(
        {},
        state, action.value.instance || {},
        action.value.installation || {}
      );

      return sdkParams;
    default:
      return state;
  }
}
