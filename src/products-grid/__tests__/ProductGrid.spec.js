import React from 'react';

import { mount } from 'enzyme';
import { mockExtensionWrapper } from '../../utils/mockExtension.js';

import ProductsGrid,{ ProductsGridComponent } from '../ProductsGrid';
import CatalogSelector from '../../catalog-selector/CatalogSelector.js';
import Product from '../../product/Product.js';

describe('ProductGrid', () => {

  it('renders without crashing', async () => {
    const { Render, store } = await mockExtensionWrapper();

    mount(
      <Render>
        <ProductsGrid
          {...store.getState()}
        />
      </Render>
    );
  });

  it('should only show catalog selector if catalogs and initialised', async () => {
    const { Render, store } = await mockExtensionWrapper();

    // because comp isnt connected to redux doesnt pass catalogs so logs a warning
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(
      <Render>
        <ProductsGridComponent
          {...store.getState()}
          catalogs={[{id: '1', name: 'one'}]}
          initialised={true}
        />
      </Render>
    );

    expect(wrapper.find(CatalogSelector).exists()).toBeTruthy();
  }); 

  it('should not show catalog selector if no catalogs', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <ProductsGridComponent
          {...store.getState()}
          catalogs={[]}
          initialised={true}
        />
      </Render>
    );

    expect(wrapper.find(CatalogSelector).exists()).toBeFalsy();
  }); 

  it('should list all items', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <ProductsGridComponent
          {...store.getState()}
          catalogs={[]}
          initialised={true}
          items={[{id: '1'}, {id: '2'}]}
        />
      </Render>
    ); 

    expect(wrapper.find(Product).children().length).toBe(2);
  });
});