import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Clear } from '@material-ui/icons';
import { Card, CardActionArea, CardMedia, CardHeader, IconButton, makeStyles } from '@material-ui/core';
import { toggleProduct } from '../store/selectedItems/selectedItems.actions';

import find from 'lodash/find';
import FadeIn from '../fade-in/FadeIn';

import './product.scss';

const styles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flex: '1 1 auto',
		flexDirection: 'column',
		width: '100%',
		transition: 'border-width 0.3s',
		border: ({ isSelected }) => (isSelected ? `1px solid ${theme.palette.grey[500]}` : 'none'),
		margin: ({ isSelected }) => (isSelected ? '6px' : theme.spacing(1)),
		opacity: ({ readOnly }) => readOnly ? '0.6' : '',
		pointerEvents: ({ readOnly }) => readOnly ? 'none' : ''
	},
	cardWrapper: {
		height: '100%',
		display: 'flex'
	},
	thumbnail: {
		paddingBottom: '100%',
		marginTop: 'auto',
		backgroundColor: ({ hasImage }) => (hasImage ? 'transparent' : theme.palette.grey[100])
	},
	removeBtn: {
		marginLeft: theme.spacing(1)
	}
}));

const ProductComponent = params => {
	const [visible, setVisible] = useState(false);
	const isRemovable = params.variant === 'removable';
	const isSelected = Boolean(find(params.selectedItems, { id: params.item.id }));
	const { readOnly } = params.SDK.form;
	const toggle = () => params.toggleProduct(params.item, isSelected);

	const hideProduct = () => {
		setVisible(true);
		toggle();
	};

	useEffect(() => setVisible(true), []);

	const { name, image } = params.item;

	const classes = styles({
		isSelected,
		readOnly,
		hasImage: Boolean(image)
	});

	const cardMedia = (
		<CardMedia
			className={classes.thumbnail}
			image={image || '/images/image-icon.svg'}
			title={name}>
		</CardMedia>
	);

	const CardAction = () => (
		<IconButton 
			aria-label="Remove"
			onClick={hideProduct}
			className={classes.removeBtn}>
			<Clear />
		</IconButton>
	);

	const cardBody = (
		isRemovable ?
			cardMedia :
			<CardActionArea>{cardMedia}</CardActionArea>
	);

	return (
		<FadeIn 
			show={visible}
			className={classes.cardWrapper}>
			<Card 
				className={'product ' + classes.root}
				raised={isSelected}
				onClick={isRemovable ? null : toggle}>
	
				<CardHeader
					action={isRemovable && <CardAction />}
					title={params.item.name}
					subheader={'Product ID: ' + params.item.id}
					titleTypographyProps={{ variant: 'subtitle1' }}
					subheaderTypographyProps={{ variant: 'body2' }}/>

				{cardBody}
			</Card>
		</FadeIn>
	);
};

const Product = connect(
	({ selectedItems, backend, SDK }) => ({ selectedItems, backend, SDK }),
	({ toggleProduct })
)(ProductComponent);

export default Product;
