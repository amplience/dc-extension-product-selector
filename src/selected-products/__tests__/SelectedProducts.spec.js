import React from 'react';
import { shallow } from 'enzyme';
import { mockExtensionWrapper } from '../../utils/mockExtension.js';

import SelectedProducts from '../SelectedProducts';

describe('SelectedProducts', () => {
  it('renders without crashing', async () => {
    const { Render } = await mockExtensionWrapper();
  
    shallow((
      <Render>
        <SelectedProducts/>
      </Render>
    ));
  });
});
