// @flow

import React, { Component } from 'react';

import BusinessProductList from 'containers/BusinessProductList';

type Props = {
  params: Object,
};

class DoctorProductListPage extends Component {
  props: Props
  render() {
    const { params } = this.props;
    return (
      <BusinessProductList
        category="doctor"
        slug={params.slug}
      />
    );
  }
}

export default DoctorProductListPage;
