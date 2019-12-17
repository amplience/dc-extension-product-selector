import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress, Grid, makeStyles } from '@material-ui/core';

import Pager from '../pager/Pager';
import FadeIn from '../fade-in/FadeIn';
import Product from '../product/Product';
import CatalogSelector from '../catalog-selector/CatalogSelector';
import PaginationSummary from '../pagination-summary/PaginationSummary';

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

  return (
    <div className={classes.root}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <FadeIn show={params.items.length && !params.loading}>
            <PaginationSummary />
          </FadeIn>
        </Grid>
        <Grid item container xs={6}>
          {params.catalogs.length && params.initialised ? <CatalogSelector /> : ''}
        </Grid>
      </Grid>

      <FadeIn 
        show={params.loading}
        exitOptions={{ position: 'absolute' }}>
        <CircularProgress className={classes.loader} />
      </FadeIn>
  
      <div className={classes.items}>
        {
          !params.loading &&
          params.items.map(item => <Product key={item.id} item={item} />)
        }
      </div>
  
      <FadeIn show={params.items.length && !params.loading}>
        <Pager />
      </FadeIn>
    </div>
  );
};

const ProductsGrid = connect(
  state => ({
    items: state.items,
    loading: state.isFetching,
    initialised: state.initialised,
    catalogs: state.params.catalogs,
    backend: state.backend
  }),
  null
)(ProductsGridComponent);

export default ProductsGrid;
