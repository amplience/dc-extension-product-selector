import {trimEnd} from 'lodash';
import qs from 'qs';
export class SFCC {
  constructor(settings) {
    this.settings = settings;
  }

  getHeaders(state) {
    const {params: {authSecret, authClientId}} = state;
    return {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-id': authClientId,
        'x-auth-secret': authSecret
      }     
    }
  }

  catalogRequired() {
    return false;
  }

  getId(item) {
    return item.id;
  }

  getImage(item) {
    return item.image;
  }

  async getItems(state, ids) {
    const {params: {siteId: site_id, sfccUrl: endpoint, proxyUrl}} = state;
    try {
      const queryString = qs.stringify({
        site_id,
        endpoint, 
        ids
      });
      const params = {
        method: 'GET',
        ...this.getHeaders(state)
      }
      params.method = 'GET';
      const response = await fetch(trimEnd(proxyUrl, '/') + '/products?' + queryString, params);
      const {items} = await response.json();
      return items;
    } catch (e) {
      console.log(e);
    }
  }

  async search(state) {
    const {searchText, page, selectedCatalog, params: {siteId, sfccUrl: endpoint, proxyUrl}} = state;
    try {
      const body = {
        site_id: siteId,
        search_text: searchText,
        page: page.curPage,
        endpoint
      };
      if (selectedCatalog !== 'all') {
        body.catalog_id = selectedCatalog;
      }
      const params = {
        method: 'POST',
        body: JSON.stringify(body),
        ...this.getHeaders(state)
      };
      const response = await fetch(trimEnd(proxyUrl, '/') + '/product-search', params);
      return response.json();
    } catch(e) {
      console.log(e);
    }
  }
}