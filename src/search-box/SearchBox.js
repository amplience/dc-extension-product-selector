import React from 'react';
import { debounce, isUndefined, trim } from 'lodash';
import { connect } from 'react-redux';
import { Paper, InputBase, Divider, makeStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { changePage } from '../store/pages/pages.actions';
import { setSearchText } from '../store/searchText/searchText.actions';
import { setGlobalError } from '../store/global-error/global-error.actions';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  search: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  icon: {
    padding: 10,
    fill: 'rgba(0, 0, 0, 0.54)'
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

const debouncedSearch = debounce(async (setGlobalError, changePage) => {
  try {
    changePage(0);
  } catch (e) {
    setGlobalError('Error getting products');
  }
}, 1000);

export const SearchBoxComponent = params => {
  const classes = styles();

  const search = event => {
    const searchText = !isUndefined(event.target.value) ? event.target.value : params.searchText;
    params.setSearchText(trim(searchText));
    debouncedSearch(params.setGlobalError, params.changePage);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.search}>
        <InputBase
          value={params.searchText}
          className={classes.input}
          placeholder={params.params.searchPlaceholderText}
          inputProps={{ 'aria-label': 'search' }}
          onChange={search}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <Search className={classes.icon} />
      </Paper>
    </div>
  );
};

const SearchBox = connect(
  state => ({
    params: state.params,
    searchText: state.searchText,
  }),
  { changePage, setSearchText, setGlobalError }
)(SearchBoxComponent);

export default SearchBox;
