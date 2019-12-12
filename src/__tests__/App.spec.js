import React from 'react';
import { shallow } from 'enzyme';
import { mockExtension } from '../utils/mockExtension';

it('renders without crashing', async () => {
  const { App } = await mockExtension();

  shallow(<App/>);
});