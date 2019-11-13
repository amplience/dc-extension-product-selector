import React from 'react';
import { reject, find } from 'lodash';
import { Card, CardContent, CardActionArea, CardMedia, CardHeader, Typography, makeStyles, IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { connect } from 'react-redux';
import { setSelectedItems } from '../actions';

const styles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    '&.is-selected': {
      border: '2px solid ' + theme.palette.primary.light
    }
  },
  thumbnail: {
    paddingBottom: '100%'
  }
}));

const ProductComponent = params => {
  const classes = styles();
  const addProduct = () => {
    if(!params.selected) {
      params.setSelectedItems([...params.selectedItems, params.item]);
    }
  }
  const removeProduct = e => {
    e.preventDefault();
    params.setSelectedItems(reject(params.selectedItems, {id: params.item.id}));
  };
  const isSelected = () => !params.selected && find(params.selectedItems, {id: params.item.id});
  const header = params.selected ? (
    <CardHeader action={
      <IconButton aria-label="Remove" onClick={removeProduct}><Clear /></IconButton>
    }>
    </CardHeader>
  ) : '';
  return (
    <Card className={classes.root + (isSelected() ? ' is-selected' : '')} onClick={addProduct}>
      {header}
      <CardActionArea>
        <CardMedia
          className={classes.thumbnail}
          image={params.item.image}
          title={params.item.name}></CardMedia>
        <CardContent>
          <Typography variant="body2" component="h2">
            {params.item.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

const Product = connect(
  state => ({selectedItems: state.selectedItems}),
  {setSelectedItems}
)(ProductComponent);

export default Product;