import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { reject, slice } from 'lodash';
import { setSelectedItems } from '../actions';
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Product from '../product/Product';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex'
  },
  dragItem: {
    flex: '1 1 auto',
    transition: 'all 0.15s',
    maxWidth: '33%',
    '&:empty': {
      flex: 0
    }
  },
}));

const itemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  userSelect: 'none',
  opacity: isDragging ? 0.8 : 1
});

const SelectedProductsComponent = params => {
  const classes = styles();

  useEffect(() => {
    params.setSelectedItems(
      [
        {id: '1', image: 'http://placekitten.com/400/400', name: 'test 1'},
        {id: '2', image: 'http://placekitten.com/400/400', name: 'test 2'},
        {id: '3', image: 'http://placekitten.com/400/400', name: 'test 3'}
      ]
    );
  }, []);

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
  return (
    <DragDropContext onDragEnd={reorder}>
      <Droppable droppableId="droppable" direction="horizontal">
      {(provided, snapshot) => (
        <div
          className={classes.root}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >       
          {items}
          {provided.placeholder}
        </div>
      )}
      </Droppable>
    </DragDropContext>
  );
}

const SelectedProducts = connect(
  state => ({selectedItems: state.selectedItems}),
  {setSelectedItems}
)(SelectedProductsComponent)

export default SelectedProducts;