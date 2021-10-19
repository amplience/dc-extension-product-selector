import qs from 'qs';
import { trimEnd } from 'lodash';
import { ProductSelectorError } from '../ProductSelectorError';
export class SFCCReal {
  constructor(settings) {
    this.settings = settings;
    this.tokens = {};
  }

  tokenExpired(expires) {
    const FIVE_MINS = 300000;
    const expired = new Date().getTime() + FIVE_MINS;
    return expired > expires;
  }  

  async getAuth(state) {
    const {
      params: { authSecret, authClientId, sfccUrl: endpoint }
    } = state;
    const authUrl = "https://account.demandware.com/dw/oauth2/access_token";
    const authToken = btoa(authClientId + ':' + authSecret);

    const existingToken = this.tokens[authToken];
    if (existingToken) {
      if (this.tokenExpired(existingToken.expires)) {
        delete this.tokens[authToken];
      } else {
        return existingToken.token;
      }
    }

    const params = {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + authToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    };
    const response = await fetch(authUrl, params);
    if (!response.ok) {
      throw new Error('Error fetching token', await response.text(), response.statusText || 'unknown')
    }
    const token = await response.json();

    const ONE_SECOND_IN_MILLISECONDS = 1000;
    this.tokens[authToken] = {
      token: token.access_token,
      expires: new Date().getTime() + (token.expires_in * ONE_SECOND_IN_MILLISECONDS)
    };

    return token.access_token;
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
    const token = await this.getAuth(state);
    console.log(token);

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
      params: { siteId, proxyUrl, sfccUrl: endpoint }
    } = state;
    const emptyResult = { items: [], page: { numPages: 0, curPage: 0, total: 0 } };
    const token = await this.getAuth(state);
    console.log(token);

    const query = {
      bool_query: {
        must: [
          {text_query: {fields: ['id', 'name'], search_phrase: searchText}},
          {term_query: {fields: ['catalog_id'], operator: 'is', values: selectedCatalog ? [selectedCatalog] : []}}
        ]
      }
    };

    const apiPath = '/s/-/dw/data/v19_10';

    const uri = endpoint + apiPath + '/product_search?site_id='+siteId;

    const params = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        start: 0,
        count: 20,
        expand: ['images'],
        select : '(**)'
      })
    };

    const response = await fetch(uri, params);
    console.log(await response.json());

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
