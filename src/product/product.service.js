export class ProductService {
  constructor(settings) {
    this.settings = {
      store: 'RefArchGlobal',
      clientId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    };
  }

  get defaultParams() {
    return {
      method: 'POST',
      body: '',
      headers: {
        'Content-Type': 'application/json'
      }      
    };
  }

  getEndpoint(endpoint) {
    const {store, clientId} = this.settings;
    return `https://amplience01-tech-prtnr-eu03-dw.demandware.net/s/${store}/dw/shop/v18_8/${endpoint}?q=25686544M&client_id=${clientId}`;
  }

  search(searchText) {
    //search as you type
    const uri = this.getEndpoint('product_search') + '?expand=images';
    const params = this.defaultParams;
    return fetch(uri, params);
  }
}