import { mockStore } from "../../../utils/mockStore";
import { setValue, SET_ITEMS, getItems } from "../items.actions";
import { SET_GLOBAL_ERROR } from "../../global-error/global-error.actions";
import { SET_PAGE } from "../../pages/pages.actions";
import { SET_FETCHING } from "../../fetching/fetching.actions";


describe('items.actions', () => {
  it('should setValue with the SDk', async () => {
    const setValueMock = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    const store = mockStore({
      SDK: {
        field: {
          setValue: setValueMock
        }
      },
      backend: {
        exportItem: item => item
      }
    });

    await store.dispatch(setValue(['123']));

    expect(store.getActions()).toEqual([]);
    expect(setValueMock).toHaveBeenCalled();
  });

  it('should set global error of iframe message fails', async () => {
    const setValueMock = jest.fn().mockImplementation(() => {
      return Promise.reject();
    });

    const store = mockStore({
      SDK: {
        field: {
          setValue: setValueMock
        }
      }
    });

    await store.dispatch(setValue(['123']));

    expect(store.getActions()).toEqual([
      { type: SET_GLOBAL_ERROR, value: 'Could not set value' }
    ]);
  });

  it('getItems should set items to empty and page to 0 if no search text', async () => {
    const search = jest.fn();
    const store = mockStore({
      backend: {
        search
      },
      searchText: ' '
    });

    await store.dispatch(getItems()); 

    expect(store.getActions()).toEqual([
      { type: SET_PAGE, value: { numPages: 0, curPage: 0, total: 0 } },
      { type: SET_ITEMS, value: [] }
    ]);
  });

  it('getItems should call backend search', async () => {
    const returnValue = {
      items: [{}],
      page: {
        curPage: 0,
        numPages: 2,
        total: 10
      }
    };
    const search = jest.fn().mockImplementation(() => {
      return Promise.resolve(returnValue)
    });
    const state = {
      backend: {
        search
      },
      searchText: ' hello'
    };
    const store = mockStore(state);

    await store.dispatch(getItems()); 
 
    expect(search).toHaveBeenCalledWith(state);
    expect(store.getActions()).toEqual([
      { type: SET_FETCHING, value: true },
      { type: SET_PAGE, value: returnValue.page },
      { type: SET_ITEMS, value: returnValue.items },
      { type: SET_FETCHING, value: false }
    ])
  });

  it('getItems should set global error if search fails', async () => {
    const search = jest.fn().mockImplementation(() => {
      return Promise.reject()
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const state = {
      backend: {
        search
      },
      searchText: ' hello'
    };
    const store = mockStore(state);

    await store.dispatch(getItems());  

    expect(store.getActions()).toEqual([
      { type: SET_FETCHING, value: true },
      { type: SET_GLOBAL_ERROR, value: 'Could not get items' },
      { type: SET_FETCHING, value: false },
    ])
  });
});