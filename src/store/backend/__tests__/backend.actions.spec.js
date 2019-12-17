import { SET_BACKEND, setBackend, initBackend } from '../backend.actions';
import { mockStore } from '../../../utils/mockStore';
import { Hybris } from '../../../backends/Hybris.js';
import { SFCC } from '../../../backends/SFCC.js';
import { SET_CATALOG } from '../../catalog/catalog.actions';

describe('backend actions', () => {
  it('SET_BACKEND', async () => {
    const store = mockStore({});

    await store.dispatch(setBackend({}));

    expect(store.getActions()).toEqual([{ type: SET_BACKEND, value: {} }]);
  });

  it('initBackend SFCC', async () => {
    const store = mockStore({ params: { backend: 'SFCC' } });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([
      { type: SET_BACKEND, value: new SFCC({ backend: 'SFCC' }) },
      { type: SET_CATALOG, value: 'all' }
    ]);
  });

  it('initBackend Hybris', async () => {
    const params = {
      backend: 'Hybris',
      basePath: '/something',
      hybrisUrl: '/hybris',
      catalogs: [
        { id: '123', name: 'electronics' }
      ]
    };
    const store = mockStore({ params });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([
      { type: SET_BACKEND, value: new Hybris(params) },
      { type: SET_CATALOG, value: '123' }
    ]);
  });
});
