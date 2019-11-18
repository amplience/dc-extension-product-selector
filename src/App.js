import React from 'react';
import { makeStyles, MuiThemeProvider } from '@material-ui/core';

import {theme} from './theme'
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
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <SearchBox />
        <SelectedProducts />
        <ProductsGrid />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
