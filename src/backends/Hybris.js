import { ProductService } from 'sap-product-browser';

export class Hybris {

  constructor(params) {
    const { basePath, hybrisUrl } = params

    this.basePath = basePath;
    this.hybrisUrl = hybrisUrl;

    const defaultImage = '/images/image-icon.svg';

    this.productService = new ProductService(
      hybrisUrl,
      basePath,
      defaultImage
    );
  }

  catalogRequired() {
    return true;
  }

  getId(item) {
    return item.code;
  }

  getImage(item) {
    const getProductImage = ({ images }) => images.find(({ format }) => format === 'product')
    return item.images && item.images.length && getProductImage(item) ?
      this.hybrisUrl + getProductImage(item).url :
      item.defaultImageUrl;
  }

  async getItems(state, filterIds) {
    const { selectedCatalog, params } = state;
    const { currency } = params;
  
    return Promise.all(filterIds.map(id => {
      return this.productService.getByCode(selectedCatalog, id, currency);
    }))
  }

  async search(state) {
    const { page } = state;
    try {
      const { items, page } = await this._get(state);
  
      return {
        items,
        page
      }  
    }
    catch (e) {
      console.error(e);
      return { items: [], page }
    }
  }

  async _get(state) {
    const { selectedCatalog, searchText, page, params } = state;
    const { currency } = params;

    const { products, pagination } = await this.productService.search(
      selectedCatalog,
      searchText,
      currency,
      page.curPage
    )

    const {
      totalResults: total,
      currentPage: curPage,
      totalPages: numPages
    } = pagination;

    const pages = {
      total,
      curPage,
      numPages
    };

    return { items: products, page: pages };
  }
}