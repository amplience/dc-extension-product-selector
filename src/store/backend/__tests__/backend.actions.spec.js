import { SFCC } from '../../../backends/SFCC.js';
import { Hybris } from '../../../backends/Hybris';
import { CommerceTools } from '../../../backends/CommerceTools';
import { KiboCommerce } from '../../../backends/KiboCommerce.js';
import { BigCommerce } from '../../../backends/BigCommerce.js';
import { mockStore } from '../../../utils/mockStore';
import { SET_BACKEND, setBackend, initBackend } from '../backend.actions';

describe('backend actions', () => {
  it('SET_BACKEND', async () => {
    const store = mockStore({});

    await store.dispatch(setBackend({}));

    expect(store.getActions()).toEqual([{ type: SET_BACKEND, value: {} }]);
  });

  it('initBackend SFCC', async () => {
    const store = mockStore({ params: { backend: 'sfcc' } });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([{ type: SET_BACKEND, value: new SFCC({ backend: 'sfcc' }) }]);
  });

  it('initBackend commerceTools', async () => {
    const params = {
      backend: 'commercetools',
      host: 'https://auth.europe-west1.gcp.commercetools.com',
      projectKey: 'ulta-amp',
      clientId: '4h4q7if8FAsycH1Qtba6WhPQ',
      clientSecret: 'DFwdLEY3b0Y2YGRMZwBOvmIrwcIVoL6f',
      apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
    };
    const store = mockStore({
      params,
    });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([{ type: SET_BACKEND, value: new CommerceTools(params) }]);
  });

  it('initBackend Hybris', async () => {
    const params = {
      backend: 'hybris',
      hybrisUrl: '/hybris',
      hybrisEndpoint: '/occ/v2',
      catalogs: [
        {id: '123', name: 'electronics'}
      ]
    };
    const store = mockStore({ params });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([{ type: SET_BACKEND, value: new Hybris(params) }]);
  });

  it('initBackend KiboCommerce', async () => {
    const params = {
      backend: 'kibocommerce',
      apiHost: 't1234-s1234.sandbox.mozu.com',
      authHost: 'home.mozu.com',
      clientId: 'kibo.example-app-name.1.0.0.Release',
      sharedSecret: '12345_Secret',
    };
    const store = mockStore({
      params,
    });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([{ type: SET_BACKEND, value: new KiboCommerce(params) }]);
  });

  it('initBackend BigCommerce', async () => {
    const params = {
      backend: 'bigcommerce',
      storeHash: "storehash",
      accessToken: "xyz",
      apiVersion: 'v3',
      proxyUrl: "https://proxy-bigcommerce-api.com"
    };
    const store = mockStore({
      params,
    });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([{ type: SET_BACKEND, value: new BigCommerce(params) }]);
  });
});
