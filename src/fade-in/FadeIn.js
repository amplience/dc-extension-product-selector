import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const FadeIn = ({ show = true, children, exitOptions = {}, className = '' }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, ...exitOptions }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeIn;
