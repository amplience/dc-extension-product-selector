import { extension as mockExtension } from '../../../utils/mockExtension.js';
import { SFCC } from '../../../backends/SFCC.js';
import { mockStore } from '../../../utils/mockStore.js';

describe('sdk actions', () => {
  let actions;
  let extension;

  beforeEach(done => {
    const mocked = mockExtension({});
    extension = mocked.extension;
    mocked.mock();
    actions = require('../sdk.actions.js');
    done();
  });

  it('SET_SDK', async () => {
    const store = mockStore();

    await store.dispatch({
      type: 'SET_SDK',
      value: {}
    });

    const dispatched = store.getActions();

    expect(dispatched).toEqual([{ type: 'SET_SDK', value: {} }]);
  });

  it('fetchSDK failed to get items', async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation();

    const mocked = mockStore({
      params: { ...extension.params, catalogs: [{ id: '123' }] }
    }, (state, action) => {
      if (action.type === 'SET_SDK') {
        return Object.assign({}, state, { SDK: extension });
      }
      return state;
    });
   
    jest.spyOn(mocked, 'getState')
      .mockImplementationOnce(() => ({
        params: {
          ...extension.params,
          catalogs: [{ id: '123' }]
        }
      }))
      .mockImplementation(() => ({
        SDK: extension,
        backend: {
          getItems: jest.fn()
        }
      }));

    await mocked.dispatch(actions.fetchSDK());

    const dispatched = mocked.getActions();

    expect(JSON.stringify(dispatched)).toEqual(JSON.stringify(
      [
        { type: 'SET_FETCHING', value: true },
        { type: 'SET_SDK', value: extension },
        { type: 'SET_PARAMS', value: { ...extension.params } },
        { type: 'SET_BACKEND', value: new SFCC({ ...extension.params, catalogs: [{ id: '123' }]}) },
        { type: 'SET_FETCHING', value: true },
        { type: 'SET_FETCHING', value: false },
        { type: 'SET_INITIALISED', value: true },
        { type: 'SET_GLOBAL_ERROR', value: 'Could not get selected items' },
        { type: 'SET_CATALOG', value: '123' },
        { type: 'SET_FETCHING', value: false }
      ]
    ));

    spy.mockClear();
  });

  it('fetchSDK already defined', async () => {
    const mocked = mockStore({ SDK: {} });

    await mocked.dispatch(actions.fetchSDK());

    const dispatched = mocked.getActions();

    expect(dispatched).toEqual([]);
  });
});
