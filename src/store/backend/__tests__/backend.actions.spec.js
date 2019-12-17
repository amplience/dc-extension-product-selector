import { SET_BACKEND, setBackend, initBackend } from '../backend.actions';
import { mockStore } from '../../../utils/mockStore';
import { SFCC } from '../../../backends/SFCC.js';

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
      { type: SET_BACKEND, value: new SFCC({ backend: 'SFCC' }) }
    ]);
  });
});
