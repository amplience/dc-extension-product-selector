import { basicReducer } from '../../../utils/basicReducer';
import { paramReducer, params } from '../params.reducer';
import { SET_PARAMS } from '../params.actions';

describe('params reducer', () => {
  it('SET_PARAMS', () => {
    basicReducer(paramReducer, [
      {
        action: {
          type: SET_PARAMS,
          value: { instance: { backend: 'sfcc' }, installation: {} }
        },
        expected: Object.assign(params, { backend: 'sfcc' })
      },
      { action: { type: '', value: {} }, expected: params }
    ]);
  });
});
