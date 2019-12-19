import { basicReducer } from '../../../utils/basicReducer';
import { fetchingReducer } from '../fetching.reducer';
import { SET_FETCHING } from '../fetching.actions';

describe('fetching reducer', () => {
  it('SET_FETCHING', () => {
    basicReducer(fetchingReducer, [
      {
        action: {
          type: SET_FETCHING,
          value: true
        },
        expected: true
      },
      { action: { type: '', value: null }, expected: false}
    ]);
  });
});
