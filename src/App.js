import React from 'react';
import { makeStyles, MuiThemeProvider, Container } from '@material-ui/core';

import {theme} from './theme'
import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';
import SearchBox from './search-box/SearchBox';

// @TODO: node proxy
// @TODO: catalogues?
// @TODO: SDK integration
// @TODO: min/max items
// @TODO: data API
// @TODO: Styling
// @TODO: Refactor/error handling/params sanitisation
// @TODO: integrate other APIs
// @TODO: bug fixing

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

// @TODO: 'setBackend' and set in state so that itema are fetched from the correct source

const App = params => {
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
