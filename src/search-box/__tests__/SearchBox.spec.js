import React from 'react';

import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { InputBase } from '@material-ui/core';
import { mockExtensionWrapper } from '../../utils/mockExtension.js';

jest.useFakeTimers();

describe('SearchBox', () => {
  let SearchBoxComponent, SearchBox;

  beforeEach(() => {
    const Search = require('../SearchBox');

    SearchBox = Search.default;
    SearchBoxComponent = Search.SearchBoxComponent;
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders without crashing', async () => {
    const { Render } = await mockExtensionWrapper();

    shallow(
      <Render>
        <SearchBox />
      </Render>
    );
  });

  it('trim and call setSearch text on input change', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const setSearchText = jest.fn();

    const wrapper = mount(
      <Render>
        <SearchBoxComponent {...store.getState()} setSearchText={setSearchText} />
      </Render>
    );

    act(() => {
      wrapper.find(InputBase).prop('onChange')({ target: { value: ' hello' } });
    });

    expect(setSearchText).toHaveBeenCalledWith('hello');
  });
});
