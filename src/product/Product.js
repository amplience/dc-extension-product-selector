import React, {useState, useEffect} from 'react';
import { reject, find } from 'lodash';
import { Card, CardActionArea, CardMedia, CardHeader, IconButton , makeStyles } from '@material-ui/core';
import {CSSTransition} from 'react-transition-group';
import { Clear } from '@material-ui/icons';
import { connect } from 'react-redux';
import { setSelectedItems, setValue, setTouched } from '../actions';
import './product.scss';

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    border: ({isSelected}) => isSelected ? `1px solid ${theme.palette.grey[500]}` : 'none',
    margin: ({isSelected}) => isSelected ? '6px' : theme.spacing(1),
    transition: 'border-width 0.3s',
    height: 'calc(100% - 16px)',
    '&.product-enter': {
      opacity: '0 !important'
    },
    '&.product-enter-active': {
      opacity: '1 !important',
      transition: 'opacity 0.3s'
    },
    '&.product-exit-active': {
      opacity: '0 !important',
      transition: 'opacity 0.15s'
    }
  },
  thumbnail: {
    paddingBottom: '100%',
    marginTop: 'auto',
    backgroundColor: ({hasImage}) => hasImage ? 'transparent' : theme.palette.grey[100]
  },
  removeBtn: {
    marginLeft: theme.spacing(1)
  }
}));

const ProductComponent = params => {
  const isRemovable = params.variant === 'removable';
  const [visible, setVisible] = useState(false);

  useEffect(() => setVisible(true), []);

  const updateSelectedItems = (selectedItems) => {
    params.setSelectedItems(selectedItems);
    params.setTouched(true);
    params.setValue(selectedItems);
  };

  const addProduct = () => updateSelectedItems([...params.selectedItems, params.item]);
  const hideProduct = () => setVisible(false);
  const toggleProduct = () => isSelected ? removeProduct() : addProduct();
  const removeProduct = () => setTimeout(() => updateSelectedItems(reject(params.selectedItems, {id: params.item.id})), 500);
  const isSelected = !isRemovable && find(params.selectedItems, {id: params.item.id});
  const classes = styles({isSelected, hasImage: Boolean(params.item.image)});

  const cardMedia = (<CardMedia
    className={classes.thumbnail}
    image={params.item.image || '/images/image-icon.svg'}
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
      <Card className={'product ' + classes.root} raised={isSelected} onClick={isRemovable ? null : toggleProduct}>
        <CardHeader 
          action={
            isRemovable ? (<IconButton aria-label="Remove" onClick={hideProduct} className={classes.removeBtn}><Clear /></IconButton>) : ''
          }
          title={params.item.name}
          subheader={'Product ID: ' + params.item.id}
          titleTypographyProps={{variant: 'subtitle1'}}
          subheaderTypographyProps={{variant: 'body2'}}
        >
      </CardHeader>
        {cardBody}
      </Card>
    </CSSTransition>
  );
}

const Product = connect(
  state => ({selectedItems: state.selectedItems}),
  {setSelectedItems, setValue, setTouched}
)(ProductComponent);

export default Product;