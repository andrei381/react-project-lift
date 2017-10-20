// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Breadcrumbs from 'components/Breadcrumbs';
import ProfileDropdown from 'components/ProfileDropdown';

type Props = {
  children: React.Element<any>,
  user: Object,
  location: Object,
  breadcrumbPath: Object,
}

class Profile extends Component {
  props: Props
  render() {
    const { user, location, breadcrumbPath } = this.props;
    return (
      <div>
        <Helmet title="Me" />
        <Breadcrumbs path={breadcrumbPath} />
        <div className="row align-middle mb-lg">
          <div className="column">
            <h1 className="c-secondary">My Account</h1>
          </div>
          <div className="shrink column text-right t-capitalize">
            <strong>{user && user.getIn(['pointWallet', 'balance'], 0)}</strong> lift points
            <Link
              className="ml-mn"
              to="/me/rewards"
            >
              Redeem
            </Link>
          </div>
        </div>
        <div className="row column">
          <ProfileDropdown pathname={location.pathname} />
        </div>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.getIn(['app', 'user']),
  breadcrumbPath: state.getIn(['app', 'profileBreadcrumbPath']),
});

export default connect(mapStateToProps)(Profile);
