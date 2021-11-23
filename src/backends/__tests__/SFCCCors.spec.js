import { SFCCCors } from '../SFCCCors';
import { ProductSelectorError } from '../../ProductSelectorError';

describe('SFCCCors', () => {
  it("getAuth should return a cached token if it isn't yet expired", async () => {
    const sfcc = new SFCCCors();
    const THIRTY_MINS = 30 * 60 * 1000;

    sfcc.tokens[btoa('client:secret')] = {
      token: 'access',
      expires: Date.now() + THIRTY_MINS,
    };

    const state = {
      params: {
        authSecret: 'secret',
        authClientId: 'client',
      },
    };

    jest.spyOn(global, 'fetch').mockRejectedValue('Should use cached token');

    const result = await sfcc.getAuth(state);

    expect(result).toEqual('access');
  });

  it('getAuth should fetch a new token if none is present', async () => {
    const sfcc = new SFCCCors();

    const state = {
      params: {
        authSecret: 'secret',
        authClientId: 'client',
      },
    };

    const fetchValue = {
      access_token: 'access',
      expires_in: 30 * 60,
    };

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => fetchValue,
        ok: true,
      })
    );

    const result = await sfcc.getAuth(state);

    expect(global.fetch).toBeCalledWith('https://account.demandware.com/dw/oauth2/access_token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('client:secret'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    expect(sfcc.tokens[btoa('client:secret')]).toEqual({
      token: 'access',
      expires: expect.any(Number),
    });
    expect(result).toEqual('access');
  });

  it('getAuth should fetch a new token if cached is expired', async () => {
    const sfcc = new SFCCCors();

    sfcc.tokens[btoa('client:secret')] = {
      token: 'access',
      expires: Date.now(),
    };

    const state = {
      params: {
        authSecret: 'secret',
        authClientId: 'client',
      },
    };

    const fetchValue = {
      access_token: 'access',
      expires_in: 30 * 60,
    };

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => fetchValue,
        ok: true,
      })
    );

    const result = await sfcc.getAuth(state);

    expect(global.fetch).toBeCalledWith('https://account.demandware.com/dw/oauth2/access_token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('client:secret'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    expect(sfcc.tokens[btoa('client:secret')]).toEqual({
      token: 'access',
      expires: expect.any(Number),
    });
    expect(result).toEqual('access');
  });

  it('getAuth should throw if auth response is not ok', async () => {
    const sfcc = new SFCCCors();

    const state = {
      params: {
        authSecret: 'secret',
        authClientId: 'client',
      },
    };

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        text: () => 'example failure',
        statusText: 'Unauthorized',
        ok: false,
      })
    );

    await expect(sfcc.getAuth(state)).rejects.toEqual(
      new Error('Error fetching token', 'example failure', 'Unauthorized')
    );

    expect(global.fetch).toBeCalledWith('https://account.demandware.com/dw/oauth2/access_token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('client:secret'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    expect(sfcc.tokens[btoa('client:secret')]).toBeUndefined();
  });

  it('commonSearch should return items fetched from sfcc api', async () => {
    const sfcc = new SFCCCors();

    const fetchValue = {
      total: 41,
      hits: [
        {
          id: 'id1',
          name: { default: '123' },
          image: { abs_url: 'imageUrl' },
        },
      ],
    };

    const returnValue = {
      items: [{ id: 'id1', name: '123', image: 'imageUrl' }],
      page: { numPages: 3, curPage: 2, total: 41 },
    };

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => fetchValue,
      })
    );

    jest.spyOn(sfcc, 'getAuth').mockImplementation(() => Promise.resolve('testToken'));

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      selectedCatalog: 'spa',
      PAGE_SIZE: 20,
      params: {
        siteId: 'siteId',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc',
        sfccVersion: 'vTE_ST',
      },
    };

    const result = await sfcc.commonSearch(state, { example: 'query' });

    expect(global.fetch).toBeCalledWith('http://sfcc/s/-/dw/data/vTE_ST/product_search?site_id=siteId', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer testToken',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { example: 'query' },
        start: 40,
        count: 20,
        expand: ['images'],
        select: '(**)',
      }),
    });
    expect(sfcc.getAuth).toBeCalledWith(state);
    expect(result).toEqual(returnValue);
  });

  it('commonSearch should return empty search if no items returned', async () => {
    const sfcc = new SFCCCors();

    const returnValue = null;

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => returnValue,
      })
    );

    jest.spyOn(sfcc, 'getAuth').mockImplementation(() => Promise.resolve('testToken'));

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      selectedCatalog: 'spa',
      PAGE_SIZE: 20,
      params: {
        siteId: 'siteId',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc',
      },
    };

    const result = await sfcc.commonSearch(state, { example: 'query' });

    expect(global.fetch).toBeCalledWith('http://sfcc/s/-/dw/data/v21_10/product_search?site_id=siteId', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer testToken',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { example: 'query' },
        start: 40,
        count: 20,
        expand: ['images'],
        select: '(**)',
      }),
    });
    expect(sfcc.getAuth).toBeCalledWith(state);
    expect(result).toEqual({
      items: [],
      page: { numPages: 0, curPage: 0, total: 0 },
    });
  });

  it('getItems should call commonSearch with a term query containing the ids', async () => {
    const sfcc = new SFCCCors();

    const returnValue = {
      items: [{ id1: '123', id2: '456' }],
      page: { numPages: 1, curPage: 0, total: 25 },
    };

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      params: {
        siteId: 'siteId',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc',
      },
    };

    const expectedQuery = {
      term_query: {
        fields: ['id'],
        operator: 'one_of',
        values: ['id1', 'id2'],
      },
    };

    jest.spyOn(sfcc, 'commonSearch').mockImplementation(() => Promise.resolve(returnValue));

    const result = await sfcc.getItems(state, ['id1', 'id2']);

    expect(sfcc.commonSearch).toBeCalledWith(state, expectedQuery);
    expect(result).toEqual(returnValue.items);
  });

  it('getItems should call commonSearch with a term query containing the ids', async () => {
    const sfcc = new SFCCCors();

    const returnValue = {
      items: [{ id1: '123', id2: '456' }],
      page: { numPages: 1, curPage: 0, total: 25 },
    };

    const state = {
      page: { curPage: 2 },
      params: {
        siteId: 'siteId',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc',
      },
    };

    const expectedQuery = {
      term_query: {
        fields: ['id'],
        operator: 'one_of',
        values: ['id1', 'id2'],
      },
    };

    jest.spyOn(sfcc, 'commonSearch').mockImplementation(() => Promise.resolve(returnValue));

    const result = await sfcc.getItems(state, ['id1', 'id2']);

    expect(sfcc.commonSearch).toBeCalledWith(state, expectedQuery);
    expect(result).toEqual(returnValue.items);
  });

  it('getItems should log and throw error if failed', async () => {
    const sfcc = new SFCCCors();

    jest.spyOn(sfcc, 'commonSearch').mockImplementation(() => Promise.reject('Unable to connect'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const state = {
      page: { curPage: 2 },
      params: {
        siteId: 'siteId',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc',
      },
    };

    try {
      await sfcc.getItems(state, ['id1', 'id2']);
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(e).toEqual(new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_SELECTED_ITEMS));
    }
  });

  it('search should call commonSearch with a term query containing the ids', async () => {
    const sfcc = new SFCCCors();

    const returnValue = {
      items: [{ id1: '123', id2: '456' }],
      page: { numPages: 1, curPage: 0, total: 25 },
    };

    const state = {
      searchText: 'hello',
      selectedCatalog: 'catalog1',
      page: { curPage: 2 },
      params: {
        siteId: 'siteId',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc',
      },
    };

    const expectedQuery = {
      bool_query: {
        must: [
          { text_query: { fields: ['id', 'name'], search_phrase: 'hello' } },
          { term_query: { fields: ['catalog_id'], operator: 'is', values: ['catalog1'] } },
        ],
      },
    };

    jest.spyOn(sfcc, 'commonSearch').mockImplementation(() => Promise.resolve(returnValue));

    const result = await sfcc.search(state);

    expect(sfcc.commonSearch).toBeCalledWith(state, expectedQuery);
    expect(result).toEqual(returnValue);
  });

  it('search should log and throw error if failed', async () => {
    const sfcc = new SFCCCors();

    jest.spyOn(sfcc, 'commonSearch').mockImplementation(() => Promise.reject('Unable to connect'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const state = {
      searchText: 'hello',
      page: { curPage: 2 },
      params: {
        siteId: 'siteId',
        authSecret: 'secret',
        authClientId: 'client',
        sfccUrl: 'http://sfcc',
      },
    };

    try {
      await sfcc.search(state);
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(e).toEqual(new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS));
    }
  });

  it('should export item', async () => {
    const sfcc = new SFCCCors();

    const result = sfcc.exportItem({
      id: '480c5acd-a812-41b0-9a6e-b91f23851f36',
    });

    expect(result).toEqual('480c5acd-a812-41b0-9a6e-b91f23851f36');
  });
});
