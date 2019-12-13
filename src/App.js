import React from 'react';
import { makeStyles, Container } from '@material-ui/core';

import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';
import SearchBox from './search-box/SearchBox';

const styles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

const App = () => {
  const classes = styles();
  return (
    <Container className={classes.root}>
      <SelectedProducts />
      <SearchBox />
      <ProductsGrid />
    </Container>
  );
};

export default App;
