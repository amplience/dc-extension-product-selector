import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { changeCatalog, setCatalog } from '../store/catalog/catalog.actions';
import { Select, MenuItem, InputLabel, FormControl, makeStyles } from '@material-ui/core';

const styles = makeStyles(theme => ({
  root: {
    marginLeft: 'auto',
    marginBottom: theme.spacing(1)
  },
  select: {
    minWidth: 200
  }
}));

const CatalogSelectorComponent = params => {
  const [labelWidth, setLabelWidth] = useState(0);
  const [selectedCatalog, setSelectedCatalog] = useState(params.selectedCatalog);
  const classes = styles();
  const inputLabel = React.useRef(null);
  const selectCatalog = event => {
    const newCatalog = event.target.value;
    if (newCatalog === selectedCatalog) {
      return;
    }
    setSelectedCatalog(newCatalog);
    if (params.searchText.length) {
      params.changeCatalog(newCatalog);
    } else {
      params.setCatalog(newCatalog);
    }
  }

  useEffect(() => setLabelWidth(inputLabel.current.offsetWidth), []);

  return (
    <FormControl variant="outlined" className={classes.root}>
      <InputLabel id="catalog" ref={inputLabel}>
        Catalog
      </InputLabel>
      <Select
        className={classes.select}
        labelId="catalog"
        onChange={selectCatalog}
        labelWidth={labelWidth}
        value={selectedCatalog}
      >
        {params.catalogs.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const CatalogSelector = connect(
  state => ({
    catalogs: state.params.catalogs,
    searchText: state.searchText,
    selectedCatalog: state.selectedCatalog,
    backend: state.backend
  }),
  { changeCatalog, setCatalog })(CatalogSelectorComponent);

export default CatalogSelector;
