import React from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';

const PaginationSummaryComponent = params => {
  const start = params.PAGE_SIZE * params.curPage;
  const first = start + 1;
  const last = start + params.PAGE_SIZE;
  return (
  <Typography variant="body1">{`Showing ${first} to ${last} of ${params.total}`}</Typography>
  );
};

const PaginationSummary = connect(
  state => ({
    total: state.page.total,
    curPage: state.page.curPage,
    PAGE_SIZE: state.PAGE_SIZE
  }),
  {}
)(PaginationSummaryComponent);

export default PaginationSummary;