import React from 'react';

import { mount } from 'enzyme';
import { mockExtensionWrapper } from '../../utils/mockExtension.js';

import { PagerComponent } from '../Pager';

describe('Pager', () => {

  it('renders without crashing', async () => {
    const { Render } = await mockExtensionWrapper();

    mount(
      <Render>
        <PagerComponent page={{numPages: 5, curPage: 0}}/>
      </Render>
    );
  });

  it('should beable to go to the next page', async () => {
    const { Render } = await mockExtensionWrapper();

    const changePage = jest.fn();

    const wrapper = mount(
      <Render>
        <PagerComponent page={{numPages: 5, curPage: 0}} changePage={changePage}/>
      </Render>
    ); 

    wrapper.find('[aria-label="next"]').hostNodes().simulate('click')

    expect(changePage).toHaveBeenCalledWith(1);
  });

  it('should beable to go to the previous page', async () => {
    const { Render } = await mockExtensionWrapper();

    const changePage = jest.fn();

    const wrapper = mount(
      <Render>
        <PagerComponent page={{numPages: 7, curPage: 5}} changePage={changePage}/>
      </Render>
    ); 

    wrapper.find('[aria-label="previous"]').hostNodes().simulate('click')

    expect(changePage).toHaveBeenCalledWith(4);
  }); 

  it('should beable to go to the first page', async () => {
    const { Render } = await mockExtensionWrapper();

    const changePage = jest.fn();

    const wrapper = mount(
      <Render>
        <PagerComponent page={{numPages: 10, curPage: 6}} changePage={changePage}/>
      </Render>
    ); 

    wrapper.find('[aria-label="first"]').hostNodes().simulate('click')

    expect(changePage).toHaveBeenCalledWith(0);
  }); 

  it('should beable to go to the last page', async () => {
    const { Render } = await mockExtensionWrapper();

    const changePage = jest.fn();

    const wrapper = mount(
      <Render>
        <PagerComponent page={{numPages: 9, curPage: 5}} changePage={changePage}/>
      </Render>
    ); 

    wrapper.find('[aria-label="last"]').hostNodes().simulate('click')

    expect(changePage).toHaveBeenCalledWith(8);
  }); 
});
