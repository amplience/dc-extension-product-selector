import React from 'react';

import { mount } from 'enzyme';
import { mockExtensionWrapper } from '../../utils/mockExtension.js';

import { ProductComponent } from '../Product';
import { IconButton, Card } from '@material-ui/core';

describe('Product', () => {

  it('renders without crashing', async () => {
    const { Render, store } = await mockExtensionWrapper();

    mount(
      <Render>
        <ProductComponent
          {...store.getState()}
          item={{id: '1'}}
          selectedItems={[{id: '1'}]}
        />
      </Render>
    );
  });

  it('should be removeable', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <ProductComponent
          {...store.getState()}
          item={{id: '1'}}
          selectedItems={[{id: '2'}]}
          variant={'removable'}
          SDK={{form: { readOnly: true}}}
        />
      </Render>
    );

    expect(wrapper.find(IconButton).exists()).toBeTruthy();
  }); 

  it('should be not be removeable', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <ProductComponent
          {...store.getState()}
          item={{id: '1'}}
          selectedItems={[{id: '2'}]}
          SDK={{form: { readOnly: true}}}
        />
      </Render>
    );

    expect(wrapper.find(IconButton).exists()).toBeFalsy();
  }); 

  it('should beable to toggle an item', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const toggleProduct = jest.fn();
    const wrapper = mount(
      <Render>
        <ProductComponent
          {...store.getState()}
          item={{id: '1'}}
          selectedItems={[{id: '2'}]}
          SDK={{form: { readOnly: true}}}
          toggleProduct={toggleProduct}
        />
      </Render>
    );

    wrapper.find(Card).simulate('click');

    expect(toggleProduct).toBeCalledWith({id: '1'}, false);
  });

  it('should beable to hide product if removeable', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const toggleProduct = jest.fn();
    const wrapper = mount(
      <Render>
        <ProductComponent
          {...store.getState()}
          item={{id: '1'}}
          selectedItems={[{id: '2'}]}
          variant={'removable'}
          SDK={{form: { readOnly: true}}}
          toggleProduct={toggleProduct}
        />
      </Render>
    );

    wrapper.find(IconButton).simulate('click');

    expect(toggleProduct).toBeCalledWith({id: '1'}, false); 
  });
});
