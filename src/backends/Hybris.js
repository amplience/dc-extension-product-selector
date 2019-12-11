import { ProductService } from 'sap-product-browser';
import { ProductSelectorError } from '../ProductSelectorError';

export class Hybris {

  static getDefaultCatalog(params) {
    const fallback = [{ id: 'Catalog required' }];
    const { id } = (params.catalogs || fallback).shift();

    return id;
  }

  constructor(params) {
    const { basePath, hybrisUrl } = params;

    this.basePath = basePath;
    this.hybrisUrl = hybrisUrl;

    const defaultImage = '/images/image-icon.svg';

    this.productService = new ProductService(hybrisUrl, basePath, defaultImage);
  }

  async getItems(state, filterIds) {
    const { selectedCatalog, params } = state;
    const { currency } = params;

    try {
      return Promise.all(
        filterIds.map(async id => {
          const item = await this.productService.getByCode(selectedCatalog, id, currency);
  
          return this.itemModel(item);
        })
      );
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS);
    }
  }

  async search(state) {
    try {
      const { items, page } = await this._get(state);

      return {
        items,
        page
      };
    } catch (e) {
      console.error(e);
      throw new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_ITEMS);
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
    );

    const { totalResults: total, currentPage: curPage, totalPages: numPages } = pagination;

    const pages = {
      total,
      curPage,
      numPages
    };

    const items = products.map(item => this.itemModel(item))

    return { items, page: pages };
  }

  catalogRequired() {
    return true;
  }

  getImage(item) {
    const getProductImage = ({ images }) => images.find(({ format }) => format === 'product');
    return item.images && item.images.length && getProductImage(item)
      ? this.hybrisUrl + getProductImage(item).url
      : item.defaultImageUrl;
  }

  stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  itemModel({ code, name, images }) {
    return {
      id: code,
      name: this.stripHtml(name),
      image: this.getImage({ images })
    };
  }
}
