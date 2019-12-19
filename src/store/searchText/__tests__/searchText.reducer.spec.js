import { basicReducer } from '../../../utils/basicReducer';
import { SET_SEARCH_TEXT } from '../searchText.actions';
import { searchTextReducer } from '../searchText.reducer';

describe('searchText reducer', () => {
  it('SET_SEARCH_TEXT', () => {
    basicReducer(searchTextReducer, [
      {
        action: {
          type: SET_SEARCH_TEXT,
          value: 'abc'
        },
        expected: 'abc'
      },
      { action: { type: '', value: null }, expected: ''}
    ]);
  });
});
