import { ProductSelectorError } from '../ProductSelectorError';

export const productSearchQuery = /* GraphQL */ `
  query Search($query: String, $filter: String, $pageSize: Int, $startIndex: Int) {
    productSearch(query: $query, filter: $filter, pageSize: $pageSize, startIndex: $startIndex) {
      items {
        productCode
        content {
          productName
          productImages {
            imageUrl
          }
        }
      }
      totalCount
      pageSize
      startIndex
    }
  }
`;

export class APIAuthenticationHelper {
  constructor(clientId, sharedSecret, authHost) {
    this._clientId = clientId;
    this._sharedSecret = sharedSecret;
    this._authHost = authHost;
    let authTicket = undefined;
    try {
      let serializedAuth = window.localStorage.get('kibo-at');
      if (serializedAuth) {
        authTicket = JSON.parse(serializedAuth);
      }
    } catch (error) {}
    this.authData = authTicket;
  }

  _buildFetchOptions(data) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  }

  _calculateTicketExpiration(kiboAuthTicket) {
    //calculate how many milliseconds until auth expires
    const millisecsUntilExpiration = kiboAuthTicket.expires_in * 1000;
    kiboAuthTicket.expires_at = Date.now() + millisecsUntilExpiration;
    return kiboAuthTicket;
  }

  async _getAuthTicket() {
    return this.authData;
  }

  async _setAuthTicket(kiboAuthTicket) {
    try {
      window.localStorage.set('kibo-at', JSON.stringify(kiboAuthTicket));
    } catch (error) {}
    this.authData = { ...kiboAuthTicket };
  }

  async authenticate() {
    // create oauth fetch options
    const options = this._buildFetchOptions({
      client_id: this._clientId,
      client_secret: this._sharedSecret,
      grant_type: 'client_credentials',
    });
    // perform authentication
    const authTicket = await (
      await fetch(`https://${this._authHost}/api/platform/applications/authtickets/oauth`, options)
    ).json();
    // set expiration time in ms on auth ticket
    this._calculateTicketExpiration(authTicket);
    // set authentication ticket on next server runtime object
    await this._setAuthTicket(authTicket);

    return authTicket;
  }

  async refreshTicket(kiboAuthTicket) {
    // create oauth refresh fetch options
    const options = this._buildFetchOptions({
      client_id: this._clientId,
      client_secret: this._sharedSecret,
      grant_type: 'client_credentials',
      refresh_token: kiboAuthTicket && kiboAuthTicket.refresh_token,
    });
    const refreshedTicket = await (
      await fetch(`https://${this._authHost}/api/platform/applications/authtickets/oauth`, options)
    ).json();

    this._calculateTicketExpiration(refreshedTicket);

    await this._setAuthTicket(refreshedTicket);

    return refreshedTicket;
  }

  async getAccessToken() {
    // get current Kibo API auth ticket

    let authTicket = await this._getAuthTicket();
    // if no current ticket, perform auth
    // or if ticket expired, refresh auth
    if (!authTicket) {
      authTicket = await this.authenticate();
    } else if (authTicket.expires_at < Date.now()) {
      authTicket = await this.refreshTicket(authTicket);
    }

    return authTicket.access_token;
  }
}

export class KiboCommerce {
  constructor({ apiHost, authHost, clientId, sharedSecret }) {
    this.graphQLUrl = `https://${apiHost}/graphql`;
    this.authHelper = new APIAuthenticationHelper(clientId, sharedSecret, authHost);
  }

  async getAccessToken() {
    return await this.authHelper.getAccessToken();
  }

  async getHeaders() {
    const authToken = await this.getAccessToken();
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async performSearch({ query, filter, pageSize, startIndex }) {
    const headers = await this.getHeaders();
    const body = {
      query: productSearchQuery,
      variables: { query, filter, pageSize, startIndex },
    };
    const params = { method: 'POST', ...headers, body: JSON.stringify(body) };
    const request = await fetch(this.graphQLUrl, params);
    const response = await request.json();
    return response.data.productSearch;
  }

  async getItems(state, ids = []) {
    const { PAGE_SIZE } = state;
    const filter = ids.map((id) => `productCode eq ${id}`).join(' or ');
    try {
      const result = await this.performSearch({ filter, pageSize: PAGE_SIZE });
      return this.normalizeItems(result.items);
    } catch (error) {
      console.error(error);
      throw new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS);
    }
  }

  async search(state) {
    const { searchText, page, PAGE_SIZE } = state;
    try {
      const startIndex = (page.curPage || 0) * PAGE_SIZE;
      const result = await this.performSearch({ query: searchText, pageSize: PAGE_SIZE, startIndex });
      if (!result.totalCount) {
        return {
          items: [],
          page: { numPages: 0, curPage: 0, total: 0 },
        };
      }
      return {
        items: this.normalizeItems(result.items),
        page: {
          numPages: Math.ceil(result.totalCount / PAGE_SIZE),
          curPage: page.curPage,
          total: result.totalCount,
        },
      };
    } catch (error) {
      console.error(error);
      throw new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS);
    }
  }

  exportItem(item) {
    return item.id;
  }

  getImageUrl(product) {
    const { content = {} } = product;
    const { productImages = [] } = content;
    const mainImage = productImages[0];
    return mainImage ? mainImage.imageUrl : '';
  }

  normalizeItems(items = []) {
    return items.map((product) => ({
      id: product.productCode,
      name: product.content.productName,
      image: this.getImageUrl(product),
    }));
  }
}
