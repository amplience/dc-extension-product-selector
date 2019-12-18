import { mockStore } from '../../../utils/mockStore';
import { setCatalog, SET_CATALOG, changeCatalog } from '../catalog.actions';
import { SET_PAGE } from '../../pages/pages.actions';
import { SET_FETCHING } from '../../fetching/fetching.actions';
import { SET_ITEMS } from '../../items/items.actions';

describe('catalog actions', () => {
  it('SET_CATALOG', async () => {
    const store = mockStore({});

    await store.dispatch(setCatalog('123'));

    expect(store.getActions()).toEqual([{ type: SET_CATALOG, value: '123' }]);
  });

  it('changeCatalog', async () => {
    const search = jest.fn(() => ({
      page: {
        curPage: 0,
        numPages: 12,
        total: 240
      },
      items: [{ id: '123', name: 'hi' }]
    }));

    const store = mockStore({
      searchText: '123',
      page: {
        curPage: 2,
        numPages: 12,
        total: 240
      },
      backend: {
        search
      }
    });

    await store.dispatch(changeCatalog('123'));

    expect(store.getActions()).toEqual([
      { type: SET_CATALOG, value: '123' },
      { type: SET_PAGE, value: { curPage: 0, numPages: 12, total: 240 } },
      { type: SET_FETCHING, value: true },
      {
        type: SET_PAGE,
        value: {
          curPage: 0,
          numPages: 12,
          total: 240
        }
      },
      { type: SET_ITEMS, value: [{ id: '123', name: 'hi' }] },
      { type: SET_FETCHING, value: false }
    ]);
  });
});
