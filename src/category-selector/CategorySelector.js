import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Select, MenuItem, InputLabel, FormControl, makeStyles } from '@material-ui/core';
import { setCategory } from '../actions';

const styles = makeStyles(theme => ({
  root: {
    marginLeft: 'auto'
  },
  select: {
    minWidth: 200
  }
}));

const CategorySelectorComponent = params => {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const classes = styles();
  const selectCategory = event => params.setCategory(event.target.value);

  useEffect(() => setLabelWidth(inputLabel.current.offsetWidth), []);

  return (
    <FormControl variant="outlined" className={classes.root}>
      <InputLabel id="category" ref={inputLabel}>Category</InputLabel>
      <Select
        className={classes.select}
        labelId="category"
        value={params.selectedCategory}
        onChange={selectCategory}
        labelWidth={labelWidth}
        >
          <MenuItem value="all">All</MenuItem>
        {params.categories.map(category => (
          <MenuItem value={category.id}>{category.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const CategorySelector = connect(
  state => ({
    categories: state.params.categories,
    selectedCategory: state.selectedCategory
  }),
  {setCategory}
)(CategorySelectorComponent);

export default CategorySelector;
