import React, {useState, useEffect} from 'react';
import { reject, find } from 'lodash';
import { Card, CardActionArea, CardMedia, CardHeader, IconButton } from '@material-ui/core';
import {CSSTransition} from 'react-transition-group';
import { Clear } from '@material-ui/icons';
import { connect } from 'react-redux';
import { setSelectedItems } from '../actions';
import './product.scss';

const ProductComponent = params => {
  const isRemovable = params.variant === 'removable';
  const [visible, setVisible] = useState(false);

  useEffect(() => setVisible(true), []);

  const addProduct = () => {
    params.setSelectedItems([...params.selectedItems, params.item]);
  }
  const hideProduct = () => setVisible(false);
  const removeProduct = () => setTimeout(() => params.setSelectedItems(reject(params.selectedItems, {id: params.item.id})), 500);
  const isSelected = !isRemovable && find(params.selectedItems, {id: params.item.id});

  const cardMedia = (<CardMedia
    className={'product__thumbnail'}
    image={params.item.image}
    title={params.item.name}></CardMedia>);

const cardBody = isRemovable ? cardMedia : (<CardActionArea>{cardMedia}</CardActionArea>);

  return (
    <CSSTransition 
      in={visible} 
      timeout={300} 
      unmountOnExit 
      classNames="product"
      onExited={removeProduct}
      >
      <Card className={'product' + (isSelected ? ' is-selected' : '')} onClick={!isSelected ? addProduct : null}>
        <CardHeader 
          action={
            isRemovable ? (<IconButton aria-label="Remove" onClick={hideProduct}><Clear /></IconButton>) : ''
          }
          title={params.item.name}
          subheader={'Product ID: ' + params.item.id}
        >
      </CardHeader>
        {cardBody}
      </Card>
    </CSSTransition>
  );
}

const Product = connect(
  state => ({selectedItems: state.selectedItems}),
  {setSelectedItems}
)(ProductComponent);

export default Product;