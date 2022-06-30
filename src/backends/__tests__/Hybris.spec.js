import {Hybris} from '../Hybris';
import {ProductService} from '@amplience/sap-product-browser';
import {ProductSelectorError} from "../../ProductSelectorError";

describe('Hybris', () => {
  it('should create an instance of ProductService', () => {
    const params = {hybrisUrl: 'http://test.com', hybrisEndpoint: '/endpoint/v2'};
    const hybris = new Hybris(params);

    expect(hybris.productService).toEqual(new ProductService(params.hybrisUrl, '/endpoint/v2', null));
  });

  it('should create an instance of ProductService, where a missing endpoint is replaced by /rest/v2', () => {
    const params = {hybrisUrl: 'http://test.com'};
    const hybris = new Hybris(params);

    expect(hybris.productService).toEqual(new ProductService(params.hybrisUrl, '/rest/v2', null));
  });

  it('getItems should request product for each id', async () => {
    const params = {hybrisUrl: 'http://test.com'};
    const hybris = new Hybris(params);

    let item = 0;

    jest.spyOn(hybris.productService, 'getByCode').mockImplementation(() => {
      item++;

      return Promise.resolve({
        code: `${item}`,
        name: `<a>hello ${item}</a>`,
        images: [{format: 'product', url: `/cat-${item}`}],
        catalog: 'spa'
      });
    });

    const state = {
      params: {
        currency: 'USD'
      }
    };
    const ids = [{id: '1', catalog: 'spa'}, {id: '2', catalog: 'another'}, {id: '3', catalog: 'spa2'}];

    const result = await hybris.getItems(state, ids);

    expect(hybris.productService.getByCode).toBeCalledTimes(3);
    expect(hybris.productService.getByCode).toHaveBeenCalledWith('spa', '1', 'USD');
    expect(hybris.productService.getByCode).toHaveBeenCalledWith('another', '2', 'USD');
    expect(hybris.productService.getByCode).toHaveBeenCalledWith('spa2', '3', 'USD');
    expect(result).toEqual([
      {id: '1', name: 'hello 1', image: 'http://test.com/cat-1', catalog: 'spa'},
      {id: '2', name: 'hello 2', image: 'http://test.com/cat-2', catalog: 'another'},
      {id: '3', name: 'hello 3', image: 'http://test.com/cat-3', catalog: 'spa2'}
    ]);
  });

  it('getItems should fail', async () => {
    const params = {hybrisUrl: 'http://test.com'};
    const hybris = new Hybris(params);

    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject('Unable to connect'));
    jest.spyOn(console, 'error').mockImplementation(() => {
    });

    const state = {
      params: {
        currency: 'USD'
      }
    };
    const ids = [{id: '1', catalog: 'spa'}, {id: '2', catalog: 'another'}, {id: '3', catalog: 'spa2'}];

    try {
     await hybris.getItems(state, ids);
    } catch (e) {
      expect(console.error).toBeCalledTimes(0);
      expect(e).toEqual('Unable to connect');
    }
  });

  it('search should return pages and items', async () => {
    const params = {hybrisUrl: 'http://test.com'};
    const hybris = new Hybris(params);

    jest.spyOn(hybris.productService, 'search').mockImplementation(() => {
      return Promise.resolve({
        products: [
          {code: '1', name: '<span>hello</span>', images: null, defaultImageUrl: '/cat'}
        ],
        pagination: {
          totalResults: 10,
          currentPage: 0,
          totalPages: 2
        }
      })
    });

    const state = {
      selectedCatalog: 'spa',
      searchText: 'hello',
      page: {curPage: 0},
      params: {
        currency: 'USD'
      }
    };

    const result = await hybris.search(state);

    expect(hybris.productService.search).toBeCalledWith('spa', 'hello', 'USD', 0);
    expect(result).toEqual({
      items: [{id: '1', name: 'hello', image: '/cat', catalog: 'spa'}],
      page: {
        total: 10,
        curPage: 0,
        numPages: 2
      }
    })
  });

  it('should export item', async () => {
    const params = {hybrisUrl: 'http://test.com'};
    const hybris = new Hybris(params);

    const result = hybris.exportItem({
      id: '1',
      catalog: 'amp'
    });

    expect(result).toEqual({
      id: '1',
      catalog: 'amp'
    });
  });
});
