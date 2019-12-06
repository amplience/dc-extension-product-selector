import React from 'react';
import { connect } from 'react-redux';
import { get, reject, slice } from 'lodash';
import { setSelectedItems, setValue } from '../actions';
import { makeStyles, FormHelperText, CircularProgress, Paper, Typography, Box } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import Sortable from 'react-sortablejs';

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
    },
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
  item: {
  },
  errorWrapper: {
    height: '20px',
    marginTop: 'auto'
  },
  error: {
    marginTop: theme.spacing(1)
  },
  loader: {
    margin: 'auto',
    alignSelf: 'center',
  },
  placeholder: {
    margin: 'auto',
    paddingTop: '12px',
    gridColumn: 'span 5'
  },
}));

const SelectedProductsComponent = params => {
  const classes = styles();
  const {minItems, maxItems} = get(params.SDK, 'field.schema', {});
  const reorder = (order, sortable, {oldIndex, newIndex}) => {
    const itemToMove = params.selectedItems[oldIndex];
    const remainingItems = reject(params.selectedItems, {id:  itemToMove.id});
    const reorderedItems = [
      ...slice(remainingItems, 0, newIndex),
      itemToMove,
      ...slice(remainingItems, newIndex)
    ];
    params.setSelectedItems(reorderedItems);
    params.setValue(reorderedItems);
  };
  return (
    <Paper className={'selected-products ' + classes.root}>
<Typography variant="subtitle1" component="h2" className={classes.title}>{get(params.SDK, 'field.schema.title', '')}</Typography>
      <AnimatePresence>
        {!params.initialised && (
          <motion.div className={classes.loader} exit={{opacity: 0, position: 'absolute', zIndex: 3, top: '50%', marginTop: '-20px',}}>
            <CircularProgress  />
          </motion.div>
        )}
      </AnimatePresence>
       <AnimatePresence>
          {params.initialised && ( <motion.div initial={{opacity: 0}} exit={{opacity: 0}} animate={{ opacity: 1}}>
            <Sortable 
              onChange={reorder} 
              options={{animation: 150, ghostClass: 'product-placeholder'}} 
              className={classes.items}>
              {params.selectedItems.length ? 
                  params.selectedItems.map(item => (
                    <motion.div positionTransition={{type: 'tween'}} className={classes.item} key={item.id}>
                      <Product 
                        className={classes.dragItem}
                        item={item}
                        variant="removable" />
                    </motion.div>
                  )) : 
                  (
                    <Typography component="div" variant="body1" className={classes.placeholder}>
                      <Box fontWeight="fontWeightLight">{params.params.noItemsText}</Box>
                    </Typography>
                  )}
            </Sortable>
          </motion.div>)}
      </AnimatePresence>
      <div className={classes.errorWrapper}>
          <AnimatePresence>
            {params.touched && minItems && params.selectedItems.length < minItems && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <FormHelperText error={true} className={classes.error}>You must select a minimum of {minItems} items</FormHelperText>
              </motion.div>)}
          </AnimatePresence>
          <AnimatePresence>
          {params.touched && maxItems && params.selectedItems.length > maxItems && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
              <FormHelperText error={true} className={classes.error}>You must select a maximum of {maxItems} items</FormHelperText>
            </motion.div>
          )}
          </AnimatePresence>
      </div>
    </Paper>
  );
}

const SelectedProducts = connect(
  state => ({
    selectedItems: state.selectedItems,
    SDK: state.SDK,
    params: state.params,
    touched: state.touched,
    initialised: state.initialised
  }),
  {setSelectedItems, setValue}
)(SelectedProductsComponent)

export default SelectedProducts;