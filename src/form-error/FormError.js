import React from 'react';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import FadeIn from '../fade-in/FadeIn';

const styles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(1)
  }
}));

const FormError = ({ show = true, children }) => {
  const classes = styles();

  return (
    <FadeIn show={show}>
      <FormHelperText error={true} className={classes.error}>
        {children}
      </FormHelperText>
    </FadeIn>
  );
};

export default FormError;
