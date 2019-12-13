import { selectedItemsReducer } from '../selectedItems.reducer';
import { addItem, reorder, removeItem } from '../selectedItems.actions';

describe('selectedItems.reducer', () => {
  it('should return initalState', () => {
    const result = selectedItemsReducer(undefined, {});

    expect(result).toEqual([]);
  });

  it('should beable to add a item', () => {
    const result = selectedItemsReducer(undefined, addItem({ id: '123' }));

    expect(result).toEqual([{ id: '123' }]);
  });

  it('should beable remove a item', () => {
    const result = selectedItemsReducer(
      [{ id: '123' }, { id: '456' }, { id: '789' }],
      removeItem({ id: '123' })
    );

    expect(result).toEqual([{ id: '456' }, { id: '789' }]);
  });

  it('should beable to reorder items', () => {
    const result = selectedItemsReducer(
      [{ id: '123' }, { id: '456' }, { id: '789' }],
      reorder({
        oldIndex: 0,
        newIndex: 2
      })
    );

    expect(result).toEqual([{ id: '456' }, { id: '789' }, { id: '123' }]);
  });
});
