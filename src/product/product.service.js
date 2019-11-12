export class ProductService {
  constructor(settings) {
    this.settings = settings;
    this.token = '';
  }

  get basicAuthToken() {
    return btoa(this.settings.authClientId + ':' + this.settings.authSecret + 'abc');
  }

  get defaultParams() {
    return {
      method: 'POST',
      body: '',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    };
  }

  async getToken() {
    const response = await fetch(
      this.settings.authUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + this.basicAuthToken
        },
        credentials: 'include'
      }
    );
    console.log('auth', this.basicAuthToken)
    console.log(response);
  }

  async search(searchText, retry = false) {
    try {
      const uri = this.settings.url + `product_search?site_id=${this.settings.siteId}&expand=images`;
      const params = {...this.defaultParams, 
        body: JSON.stringify(
          {
            query : {
                text_query: {
                    fields: ['id','name'],
                    search_phrase: searchText
                }
            },
            select : '(**)'
        })};
      if (this.token === '') {
        await this.getToken();
      }
      const response = await fetch(uri, params);
      if (response.status === 401) {
        if (retry) {
          throw new Error('Authorisation failed');
        }
        await this.getToken();
        this.search(searchText, true);
      }
      return response;
    } catch(e) {
      console.log(e);
    }
  }
}