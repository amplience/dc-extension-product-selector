import React from 'react';
import './SelectedProducts.scss';
import { connect } from 'react-redux';
import { setSelectedItems } from '../actions';
import Product from '../product/Product';

const SelectedProductsComponent = params => {
  const items = params.selectedItems.map(item => (
    <Product item={item} key={item.id} selected />
  ));
  return (
    <div>
      {items}
    </div>
  );
}

const SelectedProducts = connect(
  state => ({selectedItems: state.selectedItems}),
  {setSelectedItems}
)(SelectedProductsComponent)

export default SelectedProducts;