import { ProductService } from '@amplience/sap-product-browser';
import { ProductSelectorError } from '../ProductSelectorError';

export class Hybris {

  constructor({ hybrisUrl, hybrisEndpoint } = {}) {
    this.hybrisUrl = hybrisUrl;

    if (!hybrisEndpoint) {
      hybrisEndpoint = '/rest/v2';
    }

    this.hybrisEndpoint = hybrisEndpoint;

    this.productService = new ProductService(hybrisUrl, hybrisEndpoint, null);
  }

  async getItems(state, filterIds) {
    const { params } = state;
    const { currency } = params;

    const getItem = async ({id, catalog}) => {
      const item = await this.productService.getByCode(catalog, id, currency);

      return this.itemModel(item, catalog);
    };

    try {
      return Promise.all(filterIds.map(getItem));
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

    const items = products.map(item => this.itemModel(item, selectedCatalog));

    return { items, page: pages };
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

  itemModel({ code, name, images, defaultImageUrl }, catalog) {
    return {
      id: code,
      name: this.stripHtml(name),
      image: this.getImage({ images, defaultImageUrl }),
      catalog
    };
  }

  exportItem({ id, catalog }) {
    return {
      id,
      catalog
    };
  }
}
