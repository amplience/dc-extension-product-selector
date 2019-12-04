import React, {useState} from 'react';
import {debounce} from 'lodash';
import { connect } from 'react-redux';
import { changePage, setSearchText } from '../actions';
import { Paper, InputBase, IconButton, Divider, Snackbar, makeStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  search: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const debouncedSearch = debounce(async (setSnackbarVisibility, changePage) => {
  try {
    setSnackbarVisibility(false);
    changePage(0);
  } catch (e) {
    setSnackbarVisibility(true);
  }
}, 1000);

const SearchBoxComponent = params => {
  const classes = styles();
  const [showSnackbar, setSnackbarVisibility] = useState(false);

  const search = event => {
    const searchText = event.target.value || params.searchText;
    params.setSearchText(searchText);
    debouncedSearch(setSnackbarVisibility, params.changePage);
  };
  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        autoHideDuration={3000}
        onClose={() => setSnackbarVisibility(false)}
        open={showSnackbar}
        message="Error fetching products"
      />
      <Paper className={classes.search}>
        <InputBase
          value={params.searchText}
          className={classes.input}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
          onChange={search}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton 
          className={classes.iconButton}
          onClick={search}
          aria-label="search">
          <Search />
        </IconButton>
      </Paper>  
    </div>
  );
}

const SearchBox = connect(
  state => ({
    params: state.params,
    searchText: state.searchText
  }),
  {changePage, setSearchText}
)(SearchBoxComponent);

export default SearchBox;