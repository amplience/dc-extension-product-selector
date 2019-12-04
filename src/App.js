import React from 'react';
import { makeStyles, MuiThemeProvider, Container } from '@material-ui/core';

import {theme} from './theme'
import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';
import SearchBox from './search-box/SearchBox';

// @TODO: Refactor/error handling/params sanitisation
// @TODO: Other functions should go outside components for testing
// @TODO: integrate other APIs

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

const App = () => {
  const classes = styles();
  return (
    <MuiThemeProvider theme={theme}>
      <Container className={classes.root}>
        <SelectedProducts />
        <SearchBox />
        <ProductsGrid />
      </Container>
    </MuiThemeProvider>
  );
}

export default App;
