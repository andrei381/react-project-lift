// @flow

import React, { Component } from 'react';

import BusinessComment from 'containers/BusinessComment';

type Props = {
  params: Object,
  location: Object,
};

class DispensaryCommentPage extends Component {
  props: Props
  render() {
    const { params, location } = this.props;
    return (
      <BusinessComment
        category="dispensary"
        slug={params.slug}
        location={location}
      />
    );
  }
}

export default DispensaryCommentPage;
