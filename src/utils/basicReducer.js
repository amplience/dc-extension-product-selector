

export function basicReducer(reducer, dispatches) {
  dispatches.forEach(({ action, expected, state }) => {
    expect(reducer(state, action)).toEqual(expected);
  })
}