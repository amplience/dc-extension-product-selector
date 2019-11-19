import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Product from '../product/Product';
import Pager from '../pager/Pager';
import PaginationSummary from '../pagination-summary/PaginationSummary';
import CategorySelector from '../category-selector/CategorySelector';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  items: {
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
    justifyContent: 'space-between',
    width: '100%'
  },
  loader: {
    margin: theme.spacing(2)
  }
}));
const ProductsGridComponent = params => {
  const classes = styles();
  const items = params.items.map(item => (
    <Product key={item.id} item={item} />
  ));
  const loader = params.loading ? (<CircularProgress className={classes.loader} />) : '';

  return (
    <div className={classes.root}> 
      {loader}
      <Grid container alignItems="center">
        <Grid item xs={6}>
          {params.items.length ? (<PaginationSummary />) : ''}
        </Grid>
        <Grid item container xs={6}>
          {params.categories.length ? (<CategorySelector />) : ''}
        </Grid>
      </Grid>
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
    categories: state.params.categories
  }),
  null
)(ProductsGridComponent)

export default ProductsGrid;