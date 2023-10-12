import { BigCommerce } from '../BigCommerce';
import { ProductSelectorError } from '../../ProductSelectorError';

const params = {
  storeHash: "store-hash-xyz",
  accessToken: "access-token-123",
  apiVersion: 'v3',
  proxyUrl: "https://proxy-api.com"
}

function initBackend() {
  const bigCommerce = new BigCommerce(params);
  return { bigCommerce };
}
const mockFetchResponse = {
  items: [
    {
      id: 1,
      name: "productName",
      image: "imageUrl"
    }
  ],
  page: { numPages: 1, curPage: 1, total: 1 }
};

describe("Bigcommerce", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  it('should get api headers', async () => {
    const { bigCommerce } = initBackend();
    const expected = {
      'X-Auth-Token': "access-token-123",
      "Content-Type": "application/json",
      "store-hash": "store-hash-xyz",
      "api-version": 'v3'

    };
    const headers = bigCommerce.getHeaders(params)
    expect(headers).toEqual(expected)
  })

  it('should build get items fetch url and params', async () => {
    const { bigCommerce } = initBackend();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({ items: [] }),
      })
    );
    jest.spyOn(bigCommerce, 'getHeaders').mockImplementation(() => ({
      'X-Auth-Token': "access-token-123",
      "Content-Type": "application/json",
      "store-hash": "store-hash-xyz",
      "api-version": 'v3'
    })
    );
    const headers = {
      'X-Auth-Token': "access-token-123",
      "Content-Type": "application/json",
      "store-hash": "store-hash-xyz",
      "api-version": 'v3'
    }
    const fetchParams = {
      method: 'GET',
      headers
    }
    const response = await bigCommerce.getItems({}, [1, 2, 3]);
    const query = "ids=1%2C2%2C3";
    expect(global.fetch).toBeCalledWith(`${params.proxyUrl}/api/products?${query}`, fetchParams);
    expect(response).toEqual([]);
  });

  it('should get items from list of ids', async () => {
    const { bigCommerce } = initBackend();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => mockFetchResponse,
      })
    );
    const expected = [{ id: 1, name: 'productName', image: 'imageUrl' }];
    const response = await bigCommerce.getItems({}, [1]);
    expect(response).toEqual(expected);
  });

  it('should get items and return empty result set', async () => {
    const { bigCommerce } = initBackend();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({ items: [] }),
      })
    );
    const expected = [];
    const response = await bigCommerce.getItems({}, []);
    expect(response).toEqual(expected);
  });

  it('should build search fetch url and params', async () => {
    const { bigCommerce } = initBackend();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({ items: [] }),
      })
    );
    jest.spyOn(bigCommerce, 'getHeaders').mockImplementation(() => ({
      'X-Auth-Token': "access-token-123",
      "Content-Type": "application/json",
      "store-hash": "store-hash-xyz",
      "api-version": 'v3'
    })
    );
    const headers = {
      'X-Auth-Token': "access-token-123",
      "Content-Type": "application/json",
      "store-hash": "store-hash-xyz",
      "api-version": 'v3'
    }
    const body = {
      search_text: "search-text",
      limit: 10,
      page: 1,
    };
    const fetchParams = {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }
    const response = await bigCommerce.search({ searchText: "search-text", page: { curPage: 1 }, PAGE_SIZE: 10 });
    expect(global.fetch).toBeCalledWith(`${params.proxyUrl}/api/product-search`, fetchParams);
    expect(response).toEqual({ items: [] });
  });

  it('should search from search_text phrase', async () => {
    const { bigCommerce } = initBackend();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => mockFetchResponse,
      })
    );
    const expected = {
      items: [{ id: 1, name: 'productName', image: 'imageUrl' }],
      page: { numPages: 1, curPage: 1, total: 1 }
    };
    const response = await bigCommerce.search({ searchText: "search-text", page: { curPage: 1 }, PAGE_SIZE: 10 });
    expect(response).toEqual(expected);
  });

  it('should search and return empty result set', async () => {
    const { bigCommerce } = initBackend();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => null,
      })
    );
    const expected = { items: [], page: { numPages: 0, curPage: 0, total: 0 } };
    const response = await bigCommerce.search({ searchText: "search-text", page: { curPage: 1 }, PAGE_SIZE: 10 });
    expect(response).toEqual(expected);
  });

  it('should throw search fail error', async () => {
    const { bigCommerce } = initBackend();
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject('Unable to connect')
    );
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const state = { searchText: 'jacket', page: { curPage: 0 }, PAGE_SIZE: 20 };
    try {
      await bigCommerce.search(state);
    } catch (error) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(error).toEqual(new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS));
    }
  });

  it('should throw getItems fail error', async () => {
    const { bigCommerce } = initBackend();
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject('Unable to connect')
    );
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const state = { PAGE_SIZE: 20 };
    const ids = [1];

    try {
      await bigCommerce.getItems(state, ids);
    } catch (error) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(error).toEqual(
        new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS)
      );
    }
  });

  it('should export item id', () => {
    const { bigCommerce } = initBackend();
    const itemId = bigCommerce.exportItem({ id: '12345' });
    expect(itemId).toEqual('12345');
  });
})