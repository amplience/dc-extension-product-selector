import React from 'react';
import { connect } from 'react-redux'
import { setParams, setSelectedItems } from './actions';

import './App.scss';

import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';

// selector functions for complex mapping of data
// const mapStateToProps = (state /*, ownProps*/) => {
//   //get store, returns stuff needed by component
//   return {
//     counter: state.counter
//   }
// }

const mapDispatchToProps = { setParams, setSelectedItems }

const AppComponent = params => {
  return (
    <div className="product-selector">
      <SelectedProducts />
      <ProductsGrid />
    </div>
  );
}

const App = connect(
  // mapStateToProps,
  null,
  mapDispatchToProps)(AppComponent);

export default App;
