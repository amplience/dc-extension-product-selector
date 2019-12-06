import React from 'react';
import { connect } from 'react-redux';
import { get, reject, slice, filter } from 'lodash';
import { makeStyles, FormHelperText, CircularProgress, Paper, Typography, Box } from '@material-ui/core';
import { CSSTransition } from 'react-transition-group';
import Sortable from 'react-sortablejs';
import { setValue } from '../store/items/items.actions';
import { setSelectedItems } from '../store/selectedItems/selectedItems.actions';
import Product from '../product/Product';

import './selected-products.scss';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    minHeight: '200px',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  dragItem: {
    transition: 'flex 0.15s, opacity 0.15s',
    '&:empty': {
      flex: 0
    }
  },
  title: {
    fontWeight: 700
  },
  items: {
    margin: 'auto',
    width: '100%',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '100%',
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
  item: {},
  errorWrapper: {
    height: '20px',
    marginTop: 'auto'
  },
  error: {
    marginTop: 0,
    '&.errors-enter': {
      opacity: 0,
      transform: 'translate(0, -20px)'
    },
    '&.errors-enter-active': {
      opacity: 1,
      transform: 'translate(0, 0)',
      transition: 'opacity 0.3s, transform 0.3s'
    },
    '&.errors-exit-active': {
      opacity: 0,
      transform: 'translate(0, -20px)',
      transition: 'opacity 0.3s, transform 0.3s'
    }
  },
  loader: {
    margin: 'auto',
    alignSelf: 'center',
    '&.loader-enter': {
      opacity: 0
    },
    '&.loader-enter-active': {
      opacity: 1,
      transition: 'opacity 0.3s'
    },
    '&.loader-exit-active': {
      position: 'absolute',
      zIndex: 3,
      top: '50%',
      marginTop: '-20px',
      opacity: 0,
      transition: 'opacity 0.3s'
    }
  },
  placeholder: {
    margin: 'auto'
  }
}));

const SelectedProductsComponent = params => {
  const classes = styles();
  const { minItems, maxItems } = get(params.SDK, 'field.schema', {});
  const reorder = (order, sortable, { oldIndex, newIndex }) => {
    const itemToMove = params.selectedItems[oldIndex];
    const remainingItems = filter(
      reject(params.selectedItems, item => params.backend.getId(item) === params.backend.getId(itemToMove))
    );
    const reorderedItems = [...slice(remainingItems, 0, newIndex), itemToMove, ...slice(remainingItems, newIndex)];
    params.setSelectedItems(reorderedItems);
    params.setValue(reorderedItems);
  };

  return (
    <Paper className={'selected-products ' + classes.root}>
      <Typography variant="subtitle1" component="h2" className={classes.title}>
        Selected products
      </Typography>
      <CSSTransition in={!params.initialised} timeout={300} unmountOnExit classNames="loader">
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      </CSSTransition>
      <CSSTransition in={params.initialised} timeout={300} unmountOnExit>
        <Sortable
          onChange={reorder}
          options={{ animation: 150, ghostClass: 'product-placeholder' }}
          className={classes.items}
        >
          {params.selectedItems.length ? (
            params.selectedItems.map(item => (
              <div className={classes.item} key={params.backend.getId(item)}>
                <Product className={classes.dragItem} item={item} variant="removable" />
              </div>
            ))
          ) : (
            <Typography component="div" variant="body1" className={classes.placeholder}>
              <Box fontWeight="fontWeightLight">No items selected.</Box>
            </Typography>
          )}
        </Sortable>
      </CSSTransition>
      <div className={classes.errorWrapper}>
        <CSSTransition
          in={params.touched && minItems && params.selectedItems.length < minItems}
          timeout={300}
          unmountOnExit
          classNames="errors"
        >
          <FormHelperText error={true} className={classes.error}>
            You must select a minimum of {minItems} items
          </FormHelperText>
        </CSSTransition>
        <CSSTransition
          in={params.touched && maxItems && params.selectedItems.length > maxItems}
          timeout={300}
          unmountOnExit
          classNames="errors"
        >
          <FormHelperText error={true} className={classes.error}>
            You must select a maximum of {maxItems} items
          </FormHelperText>
        </CSSTransition>
      </div>
    </Paper>
  );
};

const SelectedProducts = connect(
  state => ({
    selectedItems: state.selectedItems,
    SDK: state.SDK,
    touched: state.touched,
    backend: state.backend,
    initialised: state.initialised
  }),
  { setSelectedItems, setValue }
)(SelectedProductsComponent);

export default SelectedProducts;
