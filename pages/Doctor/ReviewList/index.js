// @flow

import React, { Component } from 'react';

import BusinessReviewList from 'containers/BusinessReviewList';

type Props = {
  params: Object,
};

class DoctorReviewListPage extends Component {
  props: Props
  render() {
    const { params } = this.props;
    return (
      <BusinessReviewList
        category="doctor"
        slug={params.slug}
      />
    );
  }
}

export default DoctorReviewListPage;
