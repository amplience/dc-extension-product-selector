import { basicReducer } from "../../../utils/basicReducer";
import { sdkReducer } from "../sdk.reducer";
import { SET_SDK } from "../sdk.actions";

describe('sdk reducer', () => {
  it('SET_SDK', () => {
    basicReducer(sdkReducer, [
      { action: { type: SET_SDK, value: {}}, expected: {}},
      { action: { type: '', value: {}}, expected: null}
    ]);
  });
})