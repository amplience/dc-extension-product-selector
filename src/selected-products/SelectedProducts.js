import React from 'react';
import { connect } from 'react-redux';
import { reject, slice } from 'lodash';
import { setSelectedItems } from '../actions';
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Product from '../product/Product';
import { Paper, Typography, Box } from '@material-ui/core';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    boxSizing: 'border-box'
  },
  itemWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(1)
  },
  dragItem: {
    flex: '1 1 25%',
    transition: 'all 0.15s',
    maxWidth: '25%',
    '&:empty': {
      flex: 0
    }
  },
  title: {
    fontWeight: 700
  }
}));

const itemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  userSelect: 'none',
  opacity: isDragging ? 0.8 : 1
});

const SelectedProductsComponent = params => {
  const classes = styles();

  const reorder = ({source, destination}) => {
    if (!destination) {
      return;
    }
    const itemToMove = params.selectedItems[source.index];
    const remainingItems = reject(params.selectedItems, {id:  itemToMove.id});
    params.setSelectedItems([
      ...slice(remainingItems, 0, destination.index),
      itemToMove,
      ...slice(remainingItems, destination.index)
    ]);
  };

  const items = params.selectedItems.map((item, index) => (
    <Draggable 
      key={item.id} 
      draggableId={item.id} 
      index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.dragItem}>
              <Product 
                style={itemStyle(snapshot.isDragging, provided.draggableProps.style)}
                className={classes.dragItem}
                item={item}
                variant="removable" />
            </div>
        )}
    </Draggable>
  ));

  const empty = (
    <Typography component="div" variant="body2">
      <Box fontWeight="fontWeightLight">No items selected.</Box>
    </Typography>);
  return (
    <Paper className={classes.root}>
    <Typography variant="subtitle1" component="h2" className={classes.title}>Selected products</Typography>
    <DragDropContext onDragEnd={reorder}>
      <Droppable droppableId="droppable" direction="horizontal">
      {(provided, snapshot) => (
        <div
          className={classes.itemWrapper}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >       
          {params.selectedItems.length ? items : empty}
          {provided.placeholder}
        </div>
      )}
      </Droppable>
    </DragDropContext>
    </Paper>
  );
}

const SelectedProducts = connect(
  state => ({selectedItems: state.selectedItems}),
  {setSelectedItems}
)(SelectedProductsComponent)

export default SelectedProducts;