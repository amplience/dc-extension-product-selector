import { ProductSelectorError } from '../ProductSelectorError';
import qs from 'qs';
import { trimEnd } from 'lodash';

export class BigCommerce {
  constructor({
    storeHash,
    accessToken,
    apiVersion = 'v3',
    proxyUrl
  }) {
    this.settings = { storeHash, accessToken, apiVersion, proxyUrl };
  }

  getHeaders(state) {
    const { accessToken, storeHash, apiVersion } = state
    return {
      'X-Auth-Token': accessToken,
      "Content-Type": "application/json",
      "store-hash": storeHash,
      "api-version": apiVersion
    };
  }

  async getItems(_, filterIds = []) {
    const { proxyUrl, ...state } = this.settings;
    try {
      if (!filterIds.length) {
        return [];
      }
      const ids = filterIds.join(',');

      const queryString = qs.stringify({ ids });
      const params = {
        method: 'GET',
        headers: {
          ...this.getHeaders(state),
        }
      };

      const response = await fetch(`${trimEnd(proxyUrl, '/')}/api/products?${queryString}`, params);
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
      PAGE_SIZE,
    } = state;
    const { proxyUrl, ...settings } = this.settings;
    const emptyResult = { items: [], page: { numPages: 0, curPage: 0, total: 0 } };
    try {
      const body = {
        search_text: searchText,
        limit: PAGE_SIZE,
        page: page.curPage,
      };
      const params = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          ...this.getHeaders(settings),
        }
      };

      const response = await fetch(`${trimEnd(proxyUrl, '/')}/api/product-search`, params);

      return response.json() || emptyResult;
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS);
    }
  }

  exportItem(item) {
    return String(item.id);
  }
}
