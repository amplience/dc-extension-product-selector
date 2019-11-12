import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchBox from './search-box/SearchBox';
import Product from '../product/Product';

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
  const loader = params.loading ? 
    (<CircularProgress className={classes.loader} />) :
    '';

  return (
    <div className={classes.root}>
      <SearchBox />
      {loader}
      <div className={classes.items}>
        {items}
      </div>
    </div>
  );
}

const ProductsGrid = connect(
  state => ({
    items: state.items,
    loading: state.isFetching
  }),
  null
)(ProductsGridComponent)

export default ProductsGrid;