import { extension as mockExtension } from '../../../utils/mockExtension.js';
import { SFCC } from '../../../backends/SFCC.js';
import { mockStore } from '../../../utils/mockStore.js';

describe('sdk actions', () => {
  let actions;
  let extension;

  beforeEach(done => {
    const mocked = mockExtension();
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

  it('fetchSDK success', async () => {
    const spy = jest.spyOn(global.console, 'log').mockImplementation();

    const mocked = mockStore({ params: extension.params });

    await mocked.dispatch(actions.fetchSDK());

    const dispatched = mocked.getActions();

    expect(JSON.stringify(dispatched)).toEqual(JSON.stringify([
      { type: 'SET_FETCHING', value: true },
      { type: 'SET_SDK', value: extension },
      { type: 'SET_PARAMS', value: extension.params },
      { type: 'SET_BACKEND', value: new SFCC(extension.params) },
      { type: 'SET_CATALOG', value: 'all' },
      { type: 'SET_FETCHING', value: true },
      { type: 'SET_SELECTED_ITEMS', value: [] },
      { type: 'SET_FETCHING', value: false },
      { type: 'SET_INITIALISED', value: true },
      { type: 'SET_FETCHING', value: false }
    ]));

    spy.mockClear();
  });

  it('fetchSDK already defined', async () => {
    const mocked = mockStore({ SDK: {} });

    await mocked.dispatch(actions.fetchSDK());

    const dispatched = mocked.getActions(); 

    expect(dispatched).toEqual([]);
  });
});
