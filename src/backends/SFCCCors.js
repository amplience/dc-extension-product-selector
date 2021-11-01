import { ProductSelectorError } from '../ProductSelectorError';
import { get } from 'lodash';

export class SFCCCors {
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
      params: { authSecret, authClientId, authUrl = 'https://account.demandware.com/dw/oauth2/access_token' },
    } = state;
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
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    };

    const response = await fetch(authUrl, params);
    if (!response.ok) {
      throw new Error('Error fetching token', await response.text(), response.statusText);
    }
    const token = await response.json();

    const ONE_SECOND_IN_MILLISECONDS = 1000;
    this.tokens[authToken] = {
      token: token.access_token,
      expires: new Date().getTime() + token.expires_in * ONE_SECOND_IN_MILLISECONDS,
    };

    return token.access_token;
  }

  async commonSearch(state, query) {
    const {
      PAGE_SIZE,
      page,
      params: { siteId, sfccUrl: endpoint, sfccVersion = 'v21_10' },
    } = state;

    const token = await this.getAuth(state);

    const emptyResult = { items: [], page: { numPages: 0, curPage: 0, total: 0 } };

    const apiPath = '/s/-/dw/data/' + sfccVersion;

    const uri = endpoint + apiPath + '/product_search?site_id=' + siteId;

    const params = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        start: page.curPage * PAGE_SIZE,
        count: PAGE_SIZE,
        expand: ['images'],
        select: '(**)',
      }),
    };

    const response = await fetch(uri, params);
    const responseJson = await response.json();

    if (!responseJson) {
      return emptyResult;
    }

    const { hits, total } = responseJson;
    let items = [];
    const numPages = Math.ceil(total / PAGE_SIZE);
    const pageSettings = { numPages, curPage: page.curPage, total };

    if (hits) {
      items = hits.map((hit) => ({
        id: hit.id,
        name: get(hit, 'name.default', null),
        image: get(hit, 'image.abs_url', null),
      }));
    }

    return { items, page: pageSettings };
  }

  async getItems(state, ids) {
    const query = {
      term_query: {
        fields: ['id'],
        operator: 'one_of',
        values: ids,
      },
    };

    try {
      const { items } = await this.commonSearch(state, query);

      return items;
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_SELECTED_ITEMS);
    }
  }

  async search(state) {
    const { searchText, selectedCatalog } = state;

    const query = {
      bool_query: {
        must: [
          { text_query: { fields: ['id', 'name'], search_phrase: searchText } },
          { term_query: { fields: ['catalog_id'], operator: 'is', values: selectedCatalog ? [selectedCatalog] : [] } },
        ],
      },
    };

    try {
      return await this.commonSearch(state, query);
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS);
    }
  }

  exportItem(item) {
    return item.id;
  }
}
