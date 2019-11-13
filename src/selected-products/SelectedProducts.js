import React from 'react';
import { connect } from 'react-redux';
import { setSelectedItems } from '../actions';
import { makeStyles } from '@material-ui/core/styles';
import Product from '../product/Product';

const styles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
    justifyContent: 'space-between',
    width: '100%'
  }
}));

const SelectedProductsComponent = params => {
  const classes = styles();
  const items = params.selectedItems.map(item => (
    <Product item={item} key={item.id} variant="removable" />
  ));
  return (
    <div className={classes.root}>
      {items}
    </div>
  );
}

const SelectedProducts = connect(
  state => ({selectedItems: state.selectedItems}),
  {setSelectedItems}
)(SelectedProductsComponent)

export default SelectedProducts;