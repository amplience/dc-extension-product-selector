import { basicReducer } from '../../../utils/basicReducer';
import { initialisedReducer } from '../initialised.reducer';
import { SET_INITIALISED } from '../initialised.actions';

describe('init reducer', () => {
  it('SET_INITIALISED', () => {
    basicReducer(initialisedReducer, [
      {
        action: {
          type: SET_INITIALISED,
          value: true
        },
        expected: true
      },
      { action: { type: '', value: null }, expected: false}
    ]);
  });
});
