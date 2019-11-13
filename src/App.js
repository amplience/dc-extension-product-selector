import React from 'react';
import { makeStyles } from '@material-ui/core';

import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';
import SearchBox from './search-box/SearchBox';

const styles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

const App = params => {
  const classes = styles();
  return (
    <div className={classes.root}>
      <SearchBox />
      <SelectedProducts />
      <ProductsGrid />
    </div>
  );
}

export default App;
