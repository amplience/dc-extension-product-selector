import React from 'react';

import { mount } from 'enzyme';
import { mockExtensionWrapper } from '../../utils/mockExtension.js';

import { PaginationSummaryComponent } from '../PaginationSummary';

describe('PaginationSummary', () => {

  it('renders without crashing', async () => {
    const { Render } = await mockExtensionWrapper();

    mount(
      <Render>
        <PaginationSummaryComponent curPage={0} total={10} PAGE_SIZE={5}/>
      </Render>
    );
  });
});
