import SdkAuth from '@commercetools/sdk-auth'
import {ProductSelectorError} from '../ProductSelectorError';

export class CommerceTools {
  constructor({host, projectKey, clientId, clientSecret, apiUrl, scope = 'view_published_products', locale}) {

    this.sdkAuth = new SdkAuth({
      host,
      projectKey,
      disableRefreshToken: false,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes: [scope + ':' + projectKey],
    });

    this.apiUrl = apiUrl;
    this.locale = locale;
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
      const response = await fetch(`${this.apiUrl}/${projectKey}/product-projections?staged=false&limit=${PAGE_SIZE}&where=id in (${idsStrings})`, params);
      const {results} = await response.json();

      return this.parseResults(results);

    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS);
    }
  }

  getImage(masterVariant) {
    const largeImage = masterVariant.attributes && masterVariant.attributes.find(x => x.name === 'largeImageUrl');
    return (largeImage && largeImage.value) || (masterVariant.images && masterVariant.images.length ? masterVariant.images[0].url : '')
  }

  parseResults(data) {
    return data.map((item) => {
      return {
        id: item.id,
        name: item.name[this.locale],
        image: this.getImage(item.masterVariant)
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

      const response = await fetch(`${this.apiUrl}/${projectKey}/product-projections/search?text.${this.locale}=${searchText}&staged=false&offset=${page.curPage * PAGE_SIZE}&limit=${PAGE_SIZE}`, params);
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
