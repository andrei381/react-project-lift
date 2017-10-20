// @flow

import React, { Component } from 'react';

import BusinessComment from 'containers/BusinessComment';

type Props = {
  params: Object,
  location: Object,
};

class ProducerCommentPage extends Component {
  props: Props
  render() {
    const { params, location } = this.props;
    return (
      <BusinessComment
        category="producer"
        slug={params.slug}
        location={location}
      />
    );
  }
}

export default ProducerCommentPage;
