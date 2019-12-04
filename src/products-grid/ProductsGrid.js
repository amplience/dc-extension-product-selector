import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Product from '../product/Product';
import Pager from '../pager/Pager';
import PaginationSummary from '../pagination-summary/PaginationSummary';
import CatalogSelector from '../catalog-selector/CatalogSelector';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  items: {
    display: 'grid',
    gridTemplateColumns: '100%',
    justifyContent: 'space-between',
    width: '100%',
    '@media(min-width: 450px)': {
      gridTemplateColumns: '50% 50%'
    },
    '@media(min-width: 800px)': {
      gridTemplateColumns: '25% 25% 25% 25%'
    },
    '@media(min-width: 1024px)': {
      gridTemplateColumns: '20% 20% 20% 20% 20%'
    }
  },
  loader: {
    margin: theme.spacing(2)
  }
}));
const ProductsGridComponent = params => {
  const classes = styles();
  const items = params.loading ? '' : params.items.map(item => (
    <Product key={params.backend.getId(item)} item={item} />
  ));
  const loader = params.loading ? (<CircularProgress className={classes.loader} />) : '';

  return (
    <div className={classes.root}> 
      <Grid container alignItems="center">
        <Grid item xs={6}>
          {params.items.length && !params.loading ? (<PaginationSummary />) : ''}
        </Grid>
        <Grid item container xs={6}>
          {params.catalogs.length ? (<CatalogSelector />) : ''}
        </Grid>
      </Grid>
      {loader}
      <div className={classes.items}>
        {items}
      </div>
      {params.items.length && !params.loading ? (<Pager />) : ''}
    </div>
  );
}

const ProductsGrid = connect(
  state => ({
    items: state.items,
    loading: state.isFetching,
    catalogs: state.params.catalogs,
    backend: state.backend
  }),
  null
)(ProductsGridComponent)

export default ProductsGrid;