import { SFCC } from '../../../backends/SFCC.js';
import { Hybris } from '../../../backends/Hybris';

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

    expect(store.getActions()).toEqual([
      { type: SET_BACKEND, value: new SFCC({ backend: 'sfcc' }) }
    ]);
  });

  it('initBackend Hybris', async () => {
    const params = {
      backend: 'hybris',
      basePath: '/something',
      hybrisUrl: '/hybris',
      catalogs: [
        { id: '123', name: 'electronics' }
      ]
    };
    const store = mockStore({ params });

    await store.dispatch(initBackend());

    expect(store.getActions()).toEqual([
      { type: SET_BACKEND, value: new Hybris(params) }
    ]);
  });
});
