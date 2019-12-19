import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

export const mockStore = (state, rootReducer) => {
  const store =  configureMockStore([thunk])(state)

  if (rootReducer) {
    store.replaceReducer(rootReducer) 
  }

  return store;
};
