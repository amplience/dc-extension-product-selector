import { basicReducer } from '../../../utils/basicReducer';
import { catalogReducer } from '../catalog.reducer';
import { SET_CATALOG } from '../catalog.actions';

describe('catalog reducer', () => {
  it('SET_CATALOG', () => {
    basicReducer(catalogReducer, [
      {
        action: {
          type: SET_CATALOG,
          value: '123'
        },
        expected: '123'
      },
      { action: { type: '', value: null }, expected: 'all'}
    ]);
  });
});
