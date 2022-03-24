import { productSearchQuery, KiboCommerce } from '../KiboCommerce';
import { ProductSelectorError } from '../../ProductSelectorError';

const params = {
  apiHost: 't1234-s1234.sandbox.mozu.com',
  authHost: 'home.mozu.com',
  clientId: 'kibo.example-app-name.1.0.0.Release',
  sharedSecret: '12345_Secret',
};
const mockProduct = {
  productCode: 'productCode',
  content: {
    productName: 'productName',
    productImages: [{ imageUrl: 'imageUrl' }],
  },
};
function initBackend() {
  const kiboCommerce = new KiboCommerce(params);
  return { kiboCommerce };
}

describe('KiboCommerce', () => {
  describe('Kibo Commerce Auth Helper', () => {});
  describe('Kibo Commerce Backend', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should construct graphql api url', () => {
      const { kiboCommerce } = initBackend();
      const expected = `https://${params.apiHost}/graphql`;
      expect(kiboCommerce.graphQLUrl).toEqual(expected);
    });

    it('should get api headers', async () => {
      const { kiboCommerce } = initBackend();
      const expected = {
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
        },
      };
      jest.spyOn(kiboCommerce, 'getAccessToken').mockImplementation(() => 'token');
      const headers = await kiboCommerce.getHeaders();
      expect(headers).toEqual(expected);
    });

    it('should get items from list of ids', async () => {
      const { kiboCommerce } = initBackend();
      jest.spyOn(kiboCommerce, 'performSearch').mockImplementation(() => Promise.resolve({ items: [mockProduct] }));
      const expected = [{ id: 'productCode', name: 'productName', image: 'imageUrl' }];
      const response = await kiboCommerce.getItems({ PAGE_SIZE: 10 });
      expect(response).toEqual(expected);
    });

    it('should get items and return empty result set', async () => {
      const { kiboCommerce } = initBackend();
      jest.spyOn(kiboCommerce, 'performSearch').mockImplementation(() =>
        Promise.resolve({
          json: () => ({ items: [] }),
        })
      );
      const expected = [];
      const response = await kiboCommerce.getItems({ PAGE_SIZE: 10 });
      expect(response).toEqual(expected);
    });

    it('should build productSearch graphql query and variables', async () => {
      const { kiboCommerce } = initBackend();
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          json: () => ({
            data: {
              productSearch: {
                items: [],
              },
            },
          }),
        })
      );
      jest.spyOn(kiboCommerce, 'getHeaders').mockImplementation(() =>
        Promise.resolve({
          headers: {
            Authorization: 'Bearer token',
            'Content-Type': 'application/json',
          },
        })
      );
      const headers = {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({
        query: productSearchQuery,
        variables: { query: 'jacket', pageSize: 10, startIndex: 0 },
      });
      const response = await kiboCommerce.performSearch({ query: 'jacket', pageSize: 10, startIndex: 0 });
      expect(global.fetch).toBeCalledWith(`https://${params.apiHost}/graphql`, {
        method: 'POST',
        headers,
        body,
      });
      expect(response.items).toEqual([]);
    });

    it('should perform search', async () => {
      const { kiboCommerce } = initBackend();
      jest.spyOn(kiboCommerce, 'performSearch').mockImplementation(() =>
        Promise.resolve({
          items: [mockProduct],
          totalCount: 100,
        })
      );

      const expected = {
        items: [{ id: 'productCode', name: 'productName', image: 'imageUrl' }],
        page: {
          numPages: 5,
          curPage: 1,
          total: 100,
        },
      };

      const state = { searchText: 'jacket', page: { curPage: 1 }, PAGE_SIZE: 20 };
      const response = await kiboCommerce.search(state);
      expect(response).toEqual(expected);
    });

    it('should throw search fail error', async () => {
      const { kiboCommerce } = initBackend();
      jest.spyOn(kiboCommerce, 'performSearch').mockImplementation(() => Promise.reject('Unable to connect'));
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const state = { searchText: 'jacket', page: { curPage: 0 }, PAGE_SIZE: 20 };
      try {
        await kiboCommerce.search(state);
      } catch (error) {
        expect(console.error).toHaveBeenCalledWith('Unable to connect');
        expect(error).toEqual(new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS));
      }
    });

    it('should throw getItems fail error', async () => {
      const { kiboCommerce } = initBackend();
      jest.spyOn(kiboCommerce, 'performSearch').mockImplementation(() => Promise.reject('Unable to connect'));
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const state = { PAGE_SIZE: 20 };
      const ids = ['testid'];

      try {
        await kiboCommerce.getItems(state, ids);
      } catch (error) {
        expect(console.error).toHaveBeenCalledWith('Unable to connect');
        expect(error).toEqual(
          new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS)
        );
      }
    });

    it('should export item id', () => {
      const { kiboCommerce } = initBackend();
      const itemId = kiboCommerce.exportItem({ id: '12345' });
      expect(itemId).toEqual('12345');
    });

    it('should normalizeItems', () => {
      const { kiboCommerce } = initBackend();
      const kiboProducts = [mockProduct];
      const expected = [{ id: 'productCode', name: 'productName', image: 'imageUrl' }];
      const items = kiboCommerce.normalizeItems(kiboProducts);
      expect(items).toEqual(expected);
    });
  });
});
