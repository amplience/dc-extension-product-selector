import qs from 'qs';
import { trimEnd } from 'lodash';
import { ProductSelectorError } from '../ProductSelectorError';
export class SFCC {
  constructor(settings) {
    this.settings = settings;
  }

  getHeaders(state) {
    const {
      params: { authSecret, authClientId, sfccUrl: endpoint }
    } = state;
    return {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-id': authClientId,
        'x-auth-secret': authSecret,
        endpoint
      }
    };
  }

  async getItems(state, ids) {
    const {
      params: { siteId: site_id, proxyUrl }
    } = state;
    try {
      const queryString = qs.stringify(
        {
          site_id,
          ids
        },
        { arrayFormat: 'brackets' }
      );
      const params = {
        method: 'GET',
        ...this.getHeaders(state)
      };
      params.method = 'GET';
      const response = await fetch(trimEnd(proxyUrl, '/') + '/products?' + queryString, params);
      const { items } = await response.json();
      return items;
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS);
    }
  }

  async search(state) {
    const {
      searchText,
      page,
      selectedCatalog,
      params: { siteId, proxyUrl }
    } = state;
    const emptyResult = { items: [], page: { numPages: 0, curPage: 0, total: 0 } };

    try {
      const body = {
        site_id: siteId,
        search_text: searchText,
        page: page.curPage
      };

      if (selectedCatalog !== null) {
        body.catalog_id = selectedCatalog;
      }
      const params = {
        method: 'POST',
        body: JSON.stringify(body),
        ...this.getHeaders(state)
      };
      const response = await fetch(trimEnd(proxyUrl, '/') + '/product-search', params);
      return response.json() || emptyResult;
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS);
    }
  }

  exportItem(item) {
    return item.id;
  }
}
