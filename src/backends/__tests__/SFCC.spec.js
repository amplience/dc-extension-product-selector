import { SFCC } from '../SFCC';
import { ProductSelectorError } from '../../ProductSelectorError';

describe('SFCC', () => {
  it('should contruct headers', () => {
    const sfcc = new SFCC();

    expect(
      sfcc.getHeaders({
        params: {
          authSecret: 'secret',
          authClientId: 'client',
          sfccUrl: 'http://sfcc'
        }
      })
    ).toEqual({
      headers: {
        'Content-Type': 'application/json',
        'x-auth-id': 'client',
        'x-auth-secret': 'secret',
        endpoint: 'http://sfcc'
      }
    });
  });

  it('search should send post request', async () => {
    const sfcc = new SFCC();

    const returnValue = {
      items: [{ id: '123' }],
      page: { numPages: 1, curPage: 0, total: 25 }
    };

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => returnValue
      })
    ); 

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      selectedCatalog: 'spa',
      params: {
        siteId: 'siteId',
        proxyUrl: '127.1.168.1:8080',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc'
      }
    };

    const result = await sfcc.search(state);

    expect(global.fetch).toBeCalledWith('127.1.168.1:8080/product-search', {
      method: 'POST',
      body: JSON.stringify({
        site_id: state.params.siteId,
        search_text: state.searchText,
        page: 2,
        catalog_id: state.selectedCatalog
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-id': 'client',
        'x-auth-secret': 'secret',
        endpoint: 'http://sfcc'
      }
    });
    expect(result).toEqual(returnValue);
  });

  it('search should send post request without selectedCatalog', async () => {
    const sfcc = new SFCC();

    const returnValue = {
      items: [{ id: '123' }],
      page: { numPages: 1, curPage: 0, total: 25 }
    };

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => returnValue
      })
    );

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      params: {
        siteId: 'siteId',
        proxyUrl: '127.1.168.1:8080',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc'
      }
    };

    const result = await sfcc.search(state);

    expect(global.fetch).toBeCalledWith('127.1.168.1:8080/product-search', {
      method: 'POST',
      body: JSON.stringify({
        site_id: state.params.siteId,
        search_text: state.searchText,
        page: 2,
        catalog_id: state.selectedCatalog
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-id': 'client',
        'x-auth-secret': 'secret',
        endpoint: 'http://sfcc'
      }
    });
    expect(result).toEqual(returnValue);
  });

  it('search should return empty search if no items returned', async () => {
    const sfcc = new SFCC();

    const returnValue = null;

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => returnValue
      })
    ); 

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      selectedCatalog: 'spa',
      params: {
        siteId: 'siteId',
        proxyUrl: '127.1.168.1:8080',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc'
      }
    };

    const result = await sfcc.search(state);

    expect(global.fetch).toBeCalledWith('127.1.168.1:8080/product-search', {
      method: 'POST',
      body: JSON.stringify({
        site_id: state.params.siteId,
        search_text: state.searchText,
        page: 2,
        catalog_id: state.selectedCatalog
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-id': 'client',
        'x-auth-secret': 'secret',
        endpoint: 'http://sfcc'
      }
    });
    expect(result).toEqual({
      items: [],
      page: { numPages: 0, curPage: 0, total: 0 }
    });
  });

  it('search should log and throw error if failed', async () => {
    const sfcc = new SFCC();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject('Unable to connect')
    ); 
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      selectedCatalog: 'spa',
      params: {
        siteId: 'siteId',
        proxyUrl: '127.1.168.1:8080',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc'
      }
    };

    try {
      await sfcc.search(state);
    }
    catch (e) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(e).toEqual(new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS));
    }
  });

  it('getItems should construct url and fetch', async () => {
    const sfcc = new SFCC();
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({ items: [{ id: '123' }] })
      })
    );

    const state = {
      params: {
        siteId: 'siteId',
        proxyUrl: '127.0.168.1:8080',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc'
      }
    };

    const ids = ['123'];

    const result = await sfcc.getItems(state, ids);

    expect(global.fetch).toBeCalledWith('127.0.168.1:8080/products?site_id=siteId&ids%5B%5D=123', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-id': 'client',
        'x-auth-secret': 'secret',
        endpoint: 'http://sfcc'
      }
    });
    expect(result).toEqual([
      {
        id: '123'
      }
    ]);
  });

  it('getItems should throw error and log if request fails', async () => {
    const sfcc = new SFCC();
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject('Unable to connect'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const state = {
      params: {
        siteId: 'siteId',
        proxyUrl: '127.0.168.1:8080',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc'
      }
    };

    const ids = ['123'];

    try {
      await sfcc.getItems(state, ids);
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(e).toEqual(new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS));
    }
  });

  it('should export item', async () => {
    const sfcc = new SFCC();

    const result = sfcc.exportItem({
      id: '480c5acd-a812-41b0-9a6e-b91f23851f36',
    });

    expect(result).toEqual('480c5acd-a812-41b0-9a6e-b91f23851f36');
  });
});
