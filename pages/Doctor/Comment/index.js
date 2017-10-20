// @flow

import React, { Component } from 'react';

import BusinessComment from 'containers/BusinessComment';

type Props = {
  params: Object,
};

class DoctorCommentPage extends Component {
  props: Props
  render() {
    const { params } = this.props;
    return (
      <BusinessComment
        category="doctor"
        slug={params.slug}
      />
    );
  }
}

export default DoctorCommentPage;
