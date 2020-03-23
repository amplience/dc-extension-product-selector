import SdkAuth from '@commercetools/sdk-auth'
import {ProductSelectorError} from '../ProductSelectorError';

export class CommerceTools {
  constructor({host, projectKey, clientId, clientSecret, apiUrl}) {

    this.sdkAuth = new SdkAuth({
      host,
      projectKey,
      disableRefreshToken: false,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes: ['view_products:' + projectKey],
    });

    this.apiUrl = apiUrl;
  }

  async getHeaders() {
    this.token = await this.sdkAuth.clientCredentialsFlow();
    const {
      token_type, access_token
    } = this.token;

    return {
      headers: {
        'Authorization': `${token_type} ${access_token}`
      }
    };
  }

  async getItems(state, filterIds = []) {
    const {
      PAGE_SIZE,
      params: {
        projectKey
      }
    } = state;
    try {
      if (!filterIds.length){
        return [];
      }
      const headers = await this.getHeaders();
      const idsStrings = '"' + filterIds.join('","') + '"';

      const params = {
        method: 'GET',
        ...headers
      };
      const response = await fetch(`${this.apiUrl}/${projectKey}/products?limit=${PAGE_SIZE}&where=id in (${idsStrings})`, params);
      const {results} = await response.json();

      return this.parseProductResults(results);

    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS);
    }
  }

  getImage(images) {
    return images.length ? images[0].url : '';
  }

  parseResults(data) {
    return data.map((item) => {
      return {
        id: item.id,
        name: item.name.en,
        image: this.getImage(item.masterVariant.images)
      }
    })
  }

  parseProductResults(data) {
    return data.map((item) => {
      return {
        id: item.id,
        name: item.masterData.current.name.en,
        image: this.getImage(item.masterData.current.masterVariant.images)
      }
    })
  }

  async search(state) {
    const {
      searchText,
      page,
      PAGE_SIZE,
      params: {projectKey}
    } = state;

    try {
      const headers = await this.getHeaders();

      const params = {
        method: 'GET',
        ...headers
      };

      const response = await fetch(`${this.apiUrl}/${projectKey}/product-projections/search?text.en=${searchText}&staged=true&offset=${page.curPage * PAGE_SIZE}&limit=${PAGE_SIZE}`, params);
      const {results, total} = await response.json();

      return {
        items: this.parseResults(results),
        page: {
          numPages: Math.ceil(total / PAGE_SIZE),
          curPage: page.curPage,
          total
        }
      };
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS);
    }
  }

  exportItem(item) {
    return item.id;
  }
}
