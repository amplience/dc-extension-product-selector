import React from 'react';
import {connect} from 'react-redux';
import {CircularProgress, Grid, makeStyles} from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';

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
  const items = !params.loading && params.items.map(item => <Product key={item.id} item={item} />);

  return (
    <div className={classes.root}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
            <AnimatePresence>
              {params.items.length && !params.loading && (
              <motion.div  initial={{opacity: 0}} exit={{opacity: 0}} animate={{ opacity: 1}}>
                <PaginationSummary />
              </motion.div>)}
            </AnimatePresence>
        </Grid>
        <Grid item container xs={6}>
          {params.catalogs.length ? <CatalogSelector /> : ''}
        </Grid>
      </Grid>
        <AnimatePresence>
          {params.loading && (
          <motion.div  initial={{opacity: 0}} exit={{opacity: 0, position: 'absolute'}} animate={{ opacity: 1}}>
            <CircularProgress className={classes.loader} />
          </motion.div>)}
        </AnimatePresence>
      <div className={classes.items}>{items}</div>
      <AnimatePresence>
          {params.items.length && !params.loading && (
          <motion.div  initial={{opacity: 0}} exit={{opacity: 0, position: 'absolute'}} animate={{ opacity: 1}}>
            <Pager />
          </motion.div>)}
        </AnimatePresence>
    </div>
  );
};

const ProductsGrid = connect(
  state => ({
    items: state.items,
    loading: state.isFetching,
    catalogs: state.params.catalogs
  }),
  null
)(ProductsGridComponent);

export default ProductsGrid;
