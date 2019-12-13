import { basicReducer } from '../../../utils/basicReducer';
import { backendReducer } from '../backend.reducer';
import { SET_BACKEND } from '../backend.actions';
import { SFCC } from '../../../backends/SFCC';

describe('backend reducer', () => {
  it('SET_BACKEND', () => {
    basicReducer(backendReducer, [
      {
        action: {
          type: SET_BACKEND,
          value: new SFCC()
        },
        expected: new SFCC()
      },
      { action: { type: '', value: null }, expected: {}}
    ]);
  });
});
