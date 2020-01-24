import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button, makeStyles } from '@material-ui/core';
import { SkipNext, SkipPrevious, ArrowRight, ArrowLeft } from '@material-ui/icons';

import take from 'lodash/take';
import range from 'lodash/range';
import takeRight from 'lodash/takeRight';

import { changePage } from '../store/pages/pages.actions';

const styles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1)
  }
}));

export const PagerComponent = ({ changePage, page: { numPages, curPage } }) => {
  const classes = styles();
  const NUM_START_PAGES = 3;
  const NUM_END_PAGES = 3;
  const NUM_VISIBLE_PAGES = 6;
  const allPages = range(numPages);
  let pages = [];

  if (curPage - NUM_START_PAGES < 0) {
    pages = take(allPages, NUM_VISIBLE_PAGES);
  } else if (curPage + NUM_END_PAGES > numPages) {
    pages = takeRight(allPages, NUM_VISIBLE_PAGES);
  } else {
    const startPages = range(curPage - NUM_START_PAGES, curPage);
    const endPages = range(curPage, curPage + NUM_END_PAGES);
    pages = take([...startPages, ...endPages], NUM_VISIBLE_PAGES);
  }

  return (
    <ButtonGroup color="primary" className={classes.root}>
      <Button aria-label="first" onClick={() => changePage(0)} disabled={curPage === 0}>
        <SkipPrevious fontSize="small" />
      </Button>
      <Button aria-label="previous" onClick={() => changePage(curPage - 1)} disabled={curPage === 0}>
        <ArrowLeft fontSize="small" />
      </Button>
      {pages.map(page => (
        <Button variant={page === curPage ? 'contained' : null} key={page} onClick={() => changePage(page)}>
          {page + 1}
        </Button>
      ))}
      <Button aria-label="next" onClick={() => changePage(curPage + 1)} disabled={curPage === numPages - 1}>
        <ArrowRight fontSize="small" />
      </Button>
      <Button aria-label="last" onClick={() => changePage(numPages - 1)} disabled={curPage === numPages - 1}>
        <SkipNext fontSize="small" />
      </Button>
    </ButtonGroup>
  );
};

const Pager = connect(state => ({ page: state.page }), { changePage })(PagerComponent);

export default Pager;
