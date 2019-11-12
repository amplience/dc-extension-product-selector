import React from 'react';
import { without } from 'lodash';
import { Card, CardContent, CardActionArea, CardMedia, CardHeader, Typography, makeStyles, IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { connect } from 'react-redux';
import { setSelectedItems } from '../actions';

const styles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1)
  },
  thumbnail: {
    paddingBottom: '100%'
  }
}));

const ProductComponent = params => {
  const classes = styles();
  const addProduct = () => setSelectedItems([...params.selectedItems, params.item]);
  const removeProduct = () => setSelectedItems(without(params.selectedItems, params.item));
  const header = params.selected ? (
    <CardHeader action={
      <IconButton aria-label="Remove" onClick={removeProduct}><Clear /></IconButton>
    }>
    </CardHeader>
  ) : '';
  return (
    <Card className={[classes.root]} onClick={addProduct}>
      {header}
      <CardActionArea>
        <CardMedia
          className={classes.thumbnail}
          image={params.item.image}
          title={params.item.name}></CardMedia>
        <CardContent>
          <Typography variant="p" component="h2">
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