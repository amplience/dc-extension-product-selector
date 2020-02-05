import React from 'react';
import { act } from 'react-dom/test-utils';
import { Select } from '@material-ui/core';
import { shallow, mount } from 'enzyme';

import { mockExtensionWrapper } from '../../utils/mockExtension.js';
import { CatalogSelectorComponent } from '../CatalogSelector';

describe('SelectedProducts', () => {
  it('renders without crashing', async () => {
    const { Render } = await mockExtensionWrapper();

    const setCatalog = jest.fn();
    const changeCatalog = jest.fn();

    shallow(
      <Render>
        <CatalogSelectorComponent
          selectedCatalog={'123'}
          catalogs={[
            {
              id: '124',
              name: 'name'
            },
            {
              id: '123',
              name: 'name 2'
            }
          ]}
          setCatalog={setCatalog}
          changeCatalog={changeCatalog}
        />
      </Render>
    );
  });

  it('should beable to change catalog', async () => {
    const { Render } = await mockExtensionWrapper();

    const setCatalog = jest.fn();
    const changeCatalog = jest.fn();

    const wrapper = mount(
      <Render>
        <CatalogSelectorComponent
          selectedCatalog={'123'}
          catalogs={[
            {
              id: '124',
              name: 'name'
            },
            {
              id: '123',
              name: 'name 2'
            }
          ]}
          setCatalog={setCatalog}
          searchText={''}
          changeCatalog={changeCatalog}
        />
      </Render>
    );

    act(() => {
      wrapper.find(Select)
             .prop('onChange')({ target: { value: '124'}})
    })
           
    expect(setCatalog).toHaveBeenCalledWith('124');
  });

  it('should reset page if search text present', async () => {
    const { Render } = await mockExtensionWrapper();

    const setCatalog = jest.fn();
    const changeCatalog = jest.fn();

    const wrapper = mount(
      <Render>
        <CatalogSelectorComponent
          selectedCatalog={'123'}
          catalogs={[
            {
              id: '124',
              name: 'name'
            },
            {
              id: '123',
              name: 'name 2'
            }
          ]}
          setCatalog={setCatalog}
          searchText={'text'}
          changeCatalog={changeCatalog}
        />
      </Render>
    );

    act(() => {
      wrapper.find(Select)
             .prop('onChange')({ target: { value: '124'}})
    })
           
    expect(changeCatalog).toHaveBeenCalledWith('124');
  });

  it('should ignore the change if value is the same', async () => {
    const { Render } = await mockExtensionWrapper();

    const setCatalog = jest.fn();
    const changeCatalog = jest.fn();

    const wrapper = mount(
      <Render>
        <CatalogSelectorComponent
          selectedCatalog={'123'}
          catalogs={[
            {
              id: '124',
              name: 'name'
            },
            {
              id: '123',
              name: 'name 2'
            }
          ]}
          setCatalog={setCatalog}
          searchText={'text'}
          changeCatalog={changeCatalog}
        />
      </Render>
    );

    act(() => {
      wrapper.find(Select)
             .prop('onChange')({ target: { value: '123'}})
    })
           
    expect(changeCatalog).not.toHaveBeenCalled();
    expect(setCatalog).not.toHaveBeenCalled();
  });
});
