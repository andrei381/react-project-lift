// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import BusinessAbout from 'containers/BusinessAbout';

import { setBreadcrumbPath } from 'containers/BusinessProfile/sagas';

type Props = {
  params: Object,
  business: Object,
  setBreadcrumbPath: Function,
};

class DispensaryAboutPage extends Component {
  props: Props
  render() {
    const { params, business } = this.props;
    return (
      <BusinessAbout
        category="dispensary"
        params={params}
        business={business}
        setBreadcrumbPath={this.props.setBreadcrumbPath}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  business: state.getIn(['profile', 'business', 'data']),
});

const mapDispatchToProps = (dispatch) => ({
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DispensaryAboutPage);
