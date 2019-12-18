import { mockStore } from '../../../utils/mockStore';
import { basicReducer } from '../../../utils/basicReducer';
import { pagesReducer } from '../pages.reducer';
import { SET_PAGE, changePage } from '../pages.actions';
import { SET_FETCHING } from '../../fetching/fetching.actions';
import { SET_ITEMS } from '../../items/items.actions';

describe('pages reducer', () => {
  it('SET_PAGE', () => {
    basicReducer(pagesReducer, [
      {
        action: {
          type: SET_PAGE,
          value: { curPage: 1 }
        },
        state: { curPage: 3, total: 100, numPages: 5 },
        expected: { curPage: 1, total: 100, numPages: 5 }
      },
      { action: { type: '', value: null }, expected: { curPage: 0, numPages: 0, total: 0 } }
    ]);
  });

  it('changePage', async () => {
    const search = jest.fn(() => ({
      page: {
        curPage: 1,
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

    await store.dispatch(changePage(1));

    expect(store.getActions()).toEqual([
      { type: SET_PAGE, value: { curPage: 1, numPages: 12, total: 240 } },
      { type: SET_FETCHING, value: true },
      {
        type: SET_PAGE,
        value: {
          curPage: 1,
          numPages: 12,
          total: 240
        }
      },
      { type: SET_ITEMS, value: [{ id: '123', name: 'hi' }] },
      { type: SET_FETCHING, value: false }
    ]);
  });
});
