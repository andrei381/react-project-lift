// @flow

import React, { Component } from 'react';

import BusinessReviewList from 'containers/BusinessReviewList';

type Props = {
  params: Object,
  location: Object,
};

class ProducerReviewListPage extends Component {
  props: Props
  render() {
    const { params, location } = this.props;
    return (
      <BusinessReviewList
        category="producer"
        slug={params.slug}
        location={location}
      />
    );
  }
}

export default ProducerReviewListPage;
