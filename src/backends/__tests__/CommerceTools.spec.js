import {CommerceTools} from '../CommerceTools';
import SdkAuth from '@commercetools/sdk-auth'
import {ProductSelectorError} from "../../ProductSelectorError";

const params = {
  "host": "https://auth.europe-west1.gcp.commercetools.com",
  "projectKey": "ulta-amp",
  "clientId": "4h4q7if8FAsycH1Qtba6WhPQ",
  "clientSecret": "DFwdLEY3b0Y2YGRMZwBOvmIrwcIVoL6f",
  "apiUrl": "https://api.europe-west1.gcp.commercetools.com",
  "scope": "view_products",
  "locale": "en"
};

const commerceTools = new CommerceTools(params);

describe('CommerceTools', () => {
  it('should create an instance of sdkAuth', () => {

    expect(commerceTools.sdkAuth).toEqual(new SdkAuth({
      host: params.host,
      projectKey: params.projectKey,
      disableRefreshToken: false,
      credentials: {
        clientId: params.clientId,
        clientSecret: params.clientSecret,
      },
      scopes: [params.scope + ':' + params.projectKey],
    }));
  });

  it('getItems should construct url and fetch', async () => {
    const headers = await commerceTools.getHeaders();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({
          results: [{
            id: '480c5acd-a812-41b0-9a6e-b91f23851f36',
            masterData: {
              current: {
                name: {
                  en: 'test'
                },
                masterVariant: {
                  images: [{
                    url: "https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081090_1_large.jpg"
                  }]
                }
              }
            }

          }]
        })
      })
    );

    const state = {
      PAGE_SIZE: 20,
      params
    };

    const ids = ['480c5acd-a812-41b0-9a6e-b91f23851f36'];

    const result = await commerceTools.getItems(state, ids);

    expect(global.fetch).toBeCalledWith("https://api.europe-west1.gcp.commercetools.com/ulta-amp/products?limit=20&where=id in (\"480c5acd-a812-41b0-9a6e-b91f23851f36\")", {
      method: 'GET',
      ...headers
    });
    expect(result).toEqual([
      {
        id: '480c5acd-a812-41b0-9a6e-b91f23851f36',
        name: 'test',
        image: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081090_1_large.jpg'
      }
    ]);
  });

  it('getItems should construct url and fetch empty', async () => {
    const headers = await commerceTools.getHeaders();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({
          results: []
        })
      })
    );

    const state = {
      PAGE_SIZE: 20,
      params
    };

    const ids = [];

    const result = await commerceTools.getItems(state, ids);

    expect(global.fetch).toBeCalledWith("https://api.europe-west1.gcp.commercetools.com/ulta-amp/products?limit=20&where=id in (\"480c5acd-a812-41b0-9a6e-b91f23851f36\")", {
      method: 'GET',
      ...headers
    });
    expect(result.length).toEqual([].length);
  });

  it('getItems should throw error and log if request fails', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject('Unable to connect'));
    jest.spyOn(console, 'error').mockImplementation(() => {
    });

    const state = {
      PAGE_SIZE: 20,
      params
    };

    const ids = ['480c5acd-a812-41b0-9a6e-b91f23851f36'];

    try {
      await commerceTools.getItems(state, ids);
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(e).toEqual(new ProductSelectorError('Could not get items', ProductSelectorError.codes.GET_SELECTED_ITEMS));
    }
  });

  it('search should send GET request', async () => {
    const headers = await commerceTools.getHeaders();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({
          total: 1,
          results: [{
            id: '480c5acd-a812-41b0-9a6e-b91f23851f36',
            name: {
              en: 'test'
            },
            masterVariant: {
              images: [{
                url: "https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081090_1_large.jpg"
              }]
            }
          }]
        })
      })
    );

    const state = {
      searchText: 'white',
      page: {curPage: 0},
      PAGE_SIZE: 20,
      params
    };

    const result = await commerceTools.search(state);

    expect(global.fetch).toBeCalledWith("https://api.europe-west1.gcp.commercetools.com/ulta-amp/product-projections/search?text.en=white&staged=false&offset=0&limit=20", {
      method: 'GET',
      ...headers
    });

    expect(result).toEqual({
      items: [{
        id: '480c5acd-a812-41b0-9a6e-b91f23851f36',
        name: 'test',
        image: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081090_1_large.jpg'
      }], page: {numPages: 1, curPage: 0, total: 1}
    });
  });

  it('search should return empty', async () => {
    const headers = await commerceTools.getHeaders();

    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => ({
          total: 0,
          results: []
        })
      })
    );

    const state = {
      searchText: 'testaa',
      page: {curPage: 0},
      PAGE_SIZE: 20,
      params
    };

    const result = await commerceTools.search(state);

    expect(global.fetch).toBeCalledWith("https://api.europe-west1.gcp.commercetools.com/ulta-amp/product-projections/search?text.en=white&staged=false&offset=0&limit=20", {
      method: 'GET',
      ...headers
    });

    expect(result).toEqual({
      items: [], page: {numPages: 0, curPage: 0, total: 0}
    });
  });

  it('search should fail', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject('Unable to connect'));
    jest.spyOn(console, 'error').mockImplementation(() => {
    });

    const state = {
      searchText: 'white',
      page: {curPage: 0},
      PAGE_SIZE: 20,
      params
    };

    try {
      await commerceTools.search(state);
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith('Unable to connect');
      expect(e).toEqual(new ProductSelectorError('Could not search', ProductSelectorError.codes.GET_ITEMS));
    }
  });

  it('should export item', async () => {
    const result = commerceTools.exportItem({
      id: '480c5acd-a812-41b0-9a6e-b91f23851f36',
    });

    expect(result).toEqual('480c5acd-a812-41b0-9a6e-b91f23851f36');
  });

  it('get image', async () => {
    const result = commerceTools.getImage([{
      url: 'https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081090_1_large.jpg',
    }]);

    expect(result).toEqual('https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/081090_1_large.jpg');
  });

  it('get image empty', async () => {
    const result = commerceTools.getImage([]);

    expect(result).toEqual('');
  });
});