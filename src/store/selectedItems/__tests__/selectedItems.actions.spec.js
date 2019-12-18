import { mockStore } from '../../../utils/mockStore.js';
import { mockExtensionWrapper } from '../../../utils/mockExtension.js';
import { SET_TOUCHED } from '../../touched/touched.actions.js';
import { SET_FETCHING } from '../../fetching/fetching.actions.js';
import { SET_INITIALISED } from '../../initialised/initialised.actions.js';
import { ProductSelectorError } from '../../../ProductSelectorError.js';

import * as actions from '../selectedItems.actions';
import { SET_GLOBAL_ERROR } from '../../global-error/global-error.actions.js';

describe('selectedItems.actions', () => {
  it('toggleProduct add', async () => {
    const { store, field } = await mockExtensionWrapper();
    const mocked = mockStore(store.getState());

    await mocked.dispatch(actions.toggleProduct({ id: '123' }, false));

    const dispatched = mocked.getActions();

    expect(dispatched).toEqual([
      { type: actions.ADD_SELECTED_ITEM, value: { id: '123' } },
      { type: SET_TOUCHED, value: true }
    ]);

    expect(field.setValue).toBeCalled();
  });

  it('toggleProduct remove', async () => {
    const { field } = await mockExtensionWrapper();
    const mocked = mockStore({ SDK: { field }, selectedItems: [] });

    await mocked.dispatch(actions.toggleProduct({ id: '123' }, true));

    const dispatched = mocked.getActions();

    expect(dispatched).toEqual([
      { type: actions.REMOVE_SELECTED_ITEM, value: { id: '123' } },
      { type: SET_TOUCHED, value: true }
    ]);
    expect(field.setValue).toBeCalled();
  });

  it('reorderProduct', async () => {
    const { field } = await mockExtensionWrapper();
    const mocked = mockStore({ SDK: { field }, selectedItems: [] });

    await mocked.dispatch(actions.reorderItems({ oldIndex: 0, newIndex: 2 }));

    const dispatched = mocked.getActions();

    expect(dispatched).toEqual([{ type: actions.REORDER_SELECTED_ITEMS, value: { oldIndex: 0, newIndex: 2 } }]);

    expect(field.setValue).toBeCalled();
  });

  it('getSelectedItems invalid schema', async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation();

    const mocked = mockStore({ SDK: { field: {} }, selectedItems: [] });

    await mocked.dispatch(actions.getSelectedItems());

    const dispatched = mocked.getActions();

    expect(global.console.error).toBeCalledWith(
      'could not load',
      new ProductSelectorError(
        `This UI extension only works with "list of text" properties`,
        ProductSelectorError.codes.INVALID_FIELD
      )
    );

    expect(dispatched).toEqual([
      { type: SET_FETCHING, value: true },
      { type: SET_FETCHING, value: false },
      { type: SET_INITIALISED, value: true },
      { type: SET_GLOBAL_ERROR, value: 'Could not get selected items' }
    ]);

    spy.mockRestore();
  });

  it('getSelectedItems value not an array', async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation();

    const backend = { getItems: jest.fn(() => Promise.resolve()) };
    const getValue = jest.fn(() => Promise.resolve([123, 234]));
    const mocked = mockStore({
      SDK: {
        field: {
          schema: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          getValue
        }
      },
      selectedItems: [],
      backend
    });

    await mocked.dispatch(actions.getSelectedItems());

    const dispatched = mocked.getActions();

    expect(getValue).toBeCalled();
    expect(global.console.error).toBeCalledWith(
      'could not load',
      new ProductSelectorError('Field value is not an array', ProductSelectorError.codes.INVALID_VALUE)
    );

    expect(dispatched).toEqual([
      { type: SET_FETCHING, value: true },
      { type: SET_FETCHING, value: false },
      { type: SET_INITIALISED, value: true },
      { type: SET_GLOBAL_ERROR, value: 'Could not get selected items' }
    ]);

    spy.mockRestore();
  });

  it('getSelectedItems success', async () => {
    const spy = jest.spyOn(global.console, 'error').mockImplementation();

    const backend = { getItems: jest.fn(() => Promise.resolve([{ id: '123' }])) };
    const getValue = jest.fn(() => Promise.resolve(['123', '234']));
    const setValue = jest.fn();
    const mocked = mockStore({
      SDK: {
        field: {
          schema: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          getValue,
          setValue
        }
      },
      selectedItems: [],
      backend
    });

    await mocked.dispatch(actions.getSelectedItems());

    const dispatched = mocked.getActions();

    expect(getValue).toBeCalled();
    expect(backend.getItems).toBeCalled();
    expect(dispatched).toEqual([
      { type: SET_FETCHING, value: true },
      { type: actions.SET_SELECTED_ITEMS, value: [{
        id: '123'
      }] },
      { type: SET_FETCHING, value: false },
      { type: SET_INITIALISED, value: true },
    ]);

    spy.mockRestore();
  });
});
