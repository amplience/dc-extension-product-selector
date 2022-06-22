import { productSearchQuery, KiboCommerce, APIAuthenticationHelper } from '../KiboCommerce';
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
const mockAuthTicket = {
  access_token: 'string',
  token_type: 'string',
  expires_in: 3600,
  expires_at: 568997884405762,
};
function initBackend() {
  const kiboCommerce = new KiboCommerce(params);
  return { kiboCommerce };
}

describe('KiboCommerce', () => {
  describe('Kibo Commerce API Auth Helper', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create auth helper for provided clientId, sharedSecret, authHost', () => {
      const { kiboCommerce } = initBackend();

      expect(kiboCommerce.authHelper._authHost).toEqual(params.authHost);
      expect(kiboCommerce.authHelper._clientId).toEqual(params.clientId);
      expect(kiboCommerce.authHelper._sharedSecret).toEqual(params.sharedSecret);
    });

    it('should perform api authentication', async () => {
      const { kiboCommerce } = initBackend();
      const { authHelper } = kiboCommerce;
      const expectedBody = JSON.stringify({
        client_id: params.clientId,
        client_secret: params.sharedSecret,
        grant_type: 'client_credentials',
      });
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          json: () => ({ ...mockAuthTicket }),
        })
      );
      await authHelper.authenticate();
      expect(global.fetch).toBeCalledWith(`https://${params.authHost}/api/platform/applications/authtickets/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expectedBody,
      });
    });

    it('should perform api authentication refresh', async () => {
      const { kiboCommerce } = initBackend();
      const { authHelper } = kiboCommerce;
      const expectedBody = JSON.stringify({
        client_id: params.clientId,
        client_secret: params.sharedSecret,
        grant_type: 'client_credentials',
        refresh_token: 'refresh',
      });
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          json: () => ({ ...mockAuthTicket }),
        })
      );
      await authHelper.refreshTicket({ refresh_token: 'refresh' });
      expect(global.fetch).toBeCalledWith(`https://${params.authHost}/api/platform/applications/authtickets/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expectedBody,
      });
    });

    it('should get access token when auth ticket is null', async () => {
      const { kiboCommerce } = initBackend();
      const { authHelper } = kiboCommerce;
      jest.spyOn(authHelper, 'authenticate').mockImplementation(() => Promise.resolve({ access_token: 'token' }));
      const accessToken = await authHelper.getAccessToken();
      expect(authHelper.authenticate).toHaveBeenCalled();
      expect(accessToken).toEqual('token');
    });

    it('should get access token from valid auth ticket', async () => {
      const { kiboCommerce } = initBackend();
      const { authHelper } = kiboCommerce;
      authHelper.authData = { expires_at: 10, access_token: 'token' };
      jest.spyOn(Date, 'now').mockImplementationOnce(() => 1);
      const accessToken = await authHelper.getAccessToken();
      expect(accessToken).toEqual('token');
    });

    it('should get access token when auth ticket is expired', async () => {
      const { kiboCommerce } = initBackend();
      const { authHelper } = kiboCommerce;
      authHelper.authData = { expires_at: 1 };
      jest.spyOn(authHelper, 'refreshTicket').mockImplementation(() => Promise.resolve({ access_token: 'token' }));
      const accessToken = await authHelper.getAccessToken();
      expect(authHelper.refreshTicket).toHaveBeenCalled();
      expect(accessToken).toEqual('token');
    });
  });

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
      jest.spyOn(kiboCommerce.authHelper, 'getAccessToken').mockImplementation(() => 'token');
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
    it('should search and return no results', async () => {
      const { kiboCommerce } = initBackend();

      jest.spyOn(kiboCommerce, 'performSearch').mockImplementation(() =>
        Promise.resolve({
          items: [],
          totalCount: 0,
        })
      );
      const expected = {
        items: [],
        page: { numPages: 0, curPage: 0, total: 0 },
      };

      const searchState = { searchText: 'jacket', page: { curPage: 1 }, PAGE_SIZE: 20 };
      const response = await kiboCommerce.search(searchState);

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

    it('should get empty image url', () => {
      const { kiboCommerce } = initBackend();
      const imageUrl = kiboCommerce.getImageUrl({});
      expect(imageUrl).toEqual('');
    });
  });
});
