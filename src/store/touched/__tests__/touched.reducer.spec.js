import { basicReducer } from '../../../utils/basicReducer';
import { touchedReducer } from '../touched.reducer';
import { SET_TOUCHED } from '../touched.actions';

describe('touched reducer', () => {
  it('SET_TOUCHED', () => {
    basicReducer(touchedReducer, [
      {
        action: {
          type: SET_TOUCHED,
          value: true
        },
        expected: true
      },
      { action: { type: '', value: null }, expected: false}
    ]);
  });
});
