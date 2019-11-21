import {trimEnd} from 'lodash';
export class SFCC {
  constructor(settings) {
    this.settings = settings;
  }

  // async getItems(state) {
  //   let items = [];
  //   const {searchText, PAGE_SIZE, page, selectedCategory} = state;
  //   const start = PAGE_SIZE * page.curPage;
  //   const categoryId = selectedCategory === 'all' ? '' : `&refine_1=cgid=${selectedCategory}`;
  //   const response = await fetch(this.settings.url + `product_search/images?q=${searchText}&client_id=${this.settings.clientId}&count=${PAGE_SIZE}&start=${start}${categoryId}`);
  //   const {hits, total} = await response.json(); 
  //   const numPages = Math.ceil(total / PAGE_SIZE);
  //   const pageSettings = {numPages, curPage: page.curPage, total};

  //   if (hits) {
  //     items = hits.map(hit => ({
  //       id: hit.product_id, 
  //       name: hit.product_name,
  //       image: hit.image.link
  //     }));
  //   }

  //   return {items, page: pageSettings};
  // }

  async search(state) {
    const {searchText, page, selectedCatalog, params: {siteId, sfccUrl: endpoint, proxyUrl, authSecret, authClientId}} = state;
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
        headers: {
          'Content-Type': 'application/json',
          'x-auth-id': authClientId,
          'x-auth-secret': authSecret
        },
        body: JSON.stringify(body)
      };
        console.log(page);
      const response = await fetch(trimEnd(proxyUrl, '/') + '/product-search', params);
      return response.json();
    } catch(e) {
      console.log(e);
    }
  }
}