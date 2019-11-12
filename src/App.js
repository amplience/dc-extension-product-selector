import React from 'react';
import { makeStyles } from '@material-ui/core';

import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';

const styles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

const App = params => {
  const classes = styles();
  return (
    <div className={classes.root}>
      <SelectedProducts />
      <ProductsGrid />
    </div>
  );
}

export default App;
