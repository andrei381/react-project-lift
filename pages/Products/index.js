// @flow

import React, { Component } from 'react';

import Search from 'containers/Search';

class ProductsPage extends Component {
  render() {
    return (
      <Search
        category="Product"
        title="Products & Accessories"
      />
    );
  }
}

export default ProductsPage;
