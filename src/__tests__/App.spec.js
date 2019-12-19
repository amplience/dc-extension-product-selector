import React from 'react';
import { mount } from 'enzyme';
import { mockExtensionWrapper } from '../utils/mockExtension';
import App from '../App';

it('renders without crashing', async () => {
  const { Render } = await mockExtensionWrapper();

  mount((
    <Render>
      <App/>
    </Render>
  ));
});