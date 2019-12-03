import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Select, MenuItem, InputLabel, FormControl, makeStyles} from '@material-ui/core';
import {setCatalog} from '../actions';

const styles = makeStyles(theme => ({
  root: {
    marginLeft: 'auto'
  },
  select: {
    minWidth: 200
  }
}));

const CatalogSelectorComponent = params => {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const classes = styles();
  const selectCatalog = event => params.setCatalog(event.target.value);

  useEffect(() => setLabelWidth(inputLabel.current.offsetWidth), []);

  return (
    <FormControl variant="outlined" className={classes.root}>
      <InputLabel id="catalog" ref={inputLabel}>
        Catalog
      </InputLabel>
      <Select
        className={classes.select}
        labelId="catalog"
        value={params.selectedCatalog}
        onChange={selectCatalog}
        labelWidth={labelWidth}
      >
        <MenuItem value="all">All</MenuItem>
        {params.catalogs.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const mapDispatchToProps = dispatch => ({
  setCatalog
})

const mapStateToProps = state => ({
  catalogs: state.params.catalogs,
  selectedCatalog: state.selectedCatalog
});

const CatalogSelector = connect(mapStateToProps, mapDispatchToProps)(CatalogSelectorComponent);

export default CatalogSelector;
