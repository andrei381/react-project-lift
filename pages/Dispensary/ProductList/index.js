// @flow

import React, { Component } from 'react';

import BusinessProductList from 'containers/BusinessProductList';

type Props = {
  params: Object,
  location: Object,
};

class DoctorProductListPage extends Component {
  props: Props
  render() {
    const { params, location } = this.props;
    return (
      <BusinessProductList
        category="dispensary"
        slug={params.slug}
        location={location}
      />
    );
  }
}

export default DoctorProductListPage;
