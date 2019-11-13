import React, {useState} from 'react';
import {debounce} from 'lodash';
import { connect } from 'react-redux';
import { setSelectedItems, getItems } from '../actions';
import { Paper, InputBase, IconButton, Divider, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Search } from '@material-ui/icons';

const styles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  search: {
    padding: '2px 4px',
    marginBottom: theme.spacing(1),
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

const debouncedSearch = debounce(async (searchText, state, setState, getItems) => {
  try {
    await getItems(searchText);
    setState({...state, showSnackbar: false});
  } catch(e) {
    setState({...state, showSnackbar: true});
  }
}, 1000);

const SearchBoxComponent = params => {
  const classes = styles();
  const [state, setState] = useState({
    searchText: '', 
    showSnackbar: false
  });

  const search = event => {
    const searchText = event.target.value;
    const updatedState = {...state, searchText};
    setState(updatedState);
    debouncedSearch(searchText, updatedState, setState, params.getItems);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        // anchorOrigin={{'top', 'center'}}
        open={state.showSnackbar}
        autoHideDuration={3000}
        message="Error fetching products"
      />
      <Paper className={classes.search}>
        <InputBase
          value={state.searchText}
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
    params: state.params
  }),
  {setSelectedItems, getItems}
)(SearchBoxComponent);

export default SearchBox;