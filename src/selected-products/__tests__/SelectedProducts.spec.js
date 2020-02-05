import React from 'react';
import { shallow, mount } from 'enzyme';
import { mockExtensionWrapper } from '../../utils/mockExtension.js';

import SelectedProducts, { SelectedProductsComponent } from '../SelectedProducts';
import { Typography, CircularProgress, FormHelperText } from '@material-ui/core';
import Product from '../../product/Product.js';
import Sortable from 'react-sortablejs';
import FormError from '../../form-error/FormError.js';

describe('SelectedProducts', () => {
  it('renders without crashing', async () => {
    const { Render } = await mockExtensionWrapper();

    shallow(
      <Render>
        <SelectedProducts />
      </Render>
    );
  });

  it('show show schema field title at the top', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'SFCC'
              }
            }
          }}
          selectedItems={[]}
        />
      </Render>
    );

    expect(wrapper.find(Typography).contains('SFCC')).toBeTruthy();
  });

  it('should just default to selected products if no schema title', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'Selected Products'
              }
            }
          }}
        />
      </Render>
    );

    expect(wrapper.find(Typography).contains('Selected Products')).toBeTruthy();
  });

  it('should loader if not initialised', async () => {
    const { Render, store } = await mockExtensionWrapper();

    let initialised = false;

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'Selected Products'
              }
            }
          }}
          initialised={initialised}
        />
      </Render>
    );

    expect(wrapper.find(CircularProgress).exists()).toBeTruthy();
  });

  it('should not show loader if initalised', async () => {
    const { Render, store } = await mockExtensionWrapper();

    let initialised = true;

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'Selected Products'
              }
            }
          }}
          initialised={initialised}
        />
      </Render>
    );

    expect(wrapper.find(CircularProgress).exists()).toBeFalsy();
  });

  it('should show products in sortable list if not in readonly', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'Selected Products'
              }
            },
            form: {
              readOnly: false
            }
          }}
          initialised={true}
          selectedItems={[
            { name: '1', image: '/1', id: '1' },
            { name: '2', image: '/2', id: '2' },
            { name: '3', image: '/3', id: '3' }
          ]}
        />
      </Render>
    );

    expect(wrapper.find(Product).children().length).toBe(3);
    expect(wrapper.find(Sortable).exists()).toBeTruthy();
  });

  it('shouldnt be sortable if readonly', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'Selected Products'
              }
            },
            form: {
              readOnly: true
            }
          }}
          initialised={true}
          selectedItems={[
            { name: '1', image: '/1', id: '1' },
            { name: '2', image: '/2', id: '2' },
            { name: '3', image: '/3', id: '3' }
          ]}
        />
      </Render>
    );

    expect(wrapper.find(Product).children().length).toBe(3);
    expect(wrapper.find(Sortable).exists()).toBeFalsy();
  });

  it('should show min item error if selected is over min amount', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'Selected Products',
                minItems: 4
              }
            },
            form: {
              readOnly: true
            }
          }}
          touched={true}
          initialised={true}
          selectedItems={[
            { name: '1', image: '/1', id: '1' },
            { name: '2', image: '/2', id: '2' },
            { name: '3', image: '/3', id: '3' }
          ]}
        />
      </Render>
    );

    expect(wrapper.find(FormHelperText).text()).toBe('You must select a minimum of 4 items');
  });

  it('should show max item error if selected is over min amount', async () => {
    const { Render, store } = await mockExtensionWrapper();

    const wrapper = mount(
      <Render>
        <SelectedProductsComponent
          {...store.getState()}
          SDK={{
            field: {
              schema: {
                title: 'Selected Products',
                maxItems: 2
              }
            },
            form: {
              readOnly: true
            }
          }}
          touched={true}
          initialised={true}
          selectedItems={[
            { name: '1', image: '/1', id: '1' },
            { name: '2', image: '/2', id: '2' },
            { name: '3', image: '/3', id: '3' }
          ]}
        />
      </Render>
    );

    expect(wrapper.find(FormHelperText).text()).toBe('You must select a maximum of 2 items');
  });
});
