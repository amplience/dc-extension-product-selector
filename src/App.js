import React from 'react';

import { theme } from './theme';
import { connect } from 'react-redux';
import { Warning } from '@material-ui/icons';
import { setGlobalError } from './store/global-error/global-error.actions';
import { makeStyles, Container, Snackbar } from '@material-ui/core';

import SearchBox from './search-box/SearchBox';
import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';

const styles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: theme.spacing(1)
  }
}));


const AppComponent = params => {
  const classes = styles();

  const message = (
    <span className={classes.message}>
      <Warning className={classes.icon} />
      {params.globalError}
    </span>
  );

  return (
    <Container className={classes.root}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => params.setGlobalError(null)}
        open={Boolean(params.globalError)}
        message={message}
      />
      <SelectedProducts />
      <SearchBox />
      <ProductsGrid />
    </Container>
  );
};

const App = connect(
  state => ({ globalError: state.globalError }),
  { setGlobalError }
)(AppComponent);

export default App;
