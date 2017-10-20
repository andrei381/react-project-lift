// @flow

import React, { Component } from 'react';

import BusinessReviewList from 'containers/BusinessReviewList';

type Props = {
  params: Object,
  location: Object,
};

class DispensaryReviewListPage extends Component {
  props: Props
  render() {
    const { params, location } = this.props;
    return (
      <BusinessReviewList
        category="dispensary"
        slug={params.slug}
        location={location}
      />
    );
  }
}

export default DispensaryReviewListPage;
