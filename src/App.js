import React from 'react';
import { makeStyles, MuiThemeProvider, Container, Snackbar } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { theme } from './theme';
import { connect } from 'react-redux';
import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';
import SearchBox from './search-box/SearchBox';
import { setGlobalError } from './store/global-error/global-error.actions';

// @TODO: Refactor/error handling/params sanitisation

const styles = makeStyles(theme => ({
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

  return (
    <MuiThemeProvider theme={theme}>
      <Container className={classes.root}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
          onClose={() => params.setGlobalError(null)}
          open={Boolean(params.globalError)}
          message={<span className={classes.message}><Warning className={classes.icon} /> {params.globalError}</span>}
        />
        <SelectedProducts />
        <SearchBox />
        <ProductsGrid />
      </Container>
    </MuiThemeProvider>
  );
};

const App = connect(
  state => ({ globalError: state.globalError }),
  { setGlobalError }
)(AppComponent);

export default App;
