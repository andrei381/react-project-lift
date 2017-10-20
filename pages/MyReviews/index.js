// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';
import { fromJS } from 'immutable';
import Helmet from 'components/Helmet';

import MemberReviews from 'components/MemberReviews';
import Preloader from 'components/Preloader';
import { setProfileBreadcrumbPath } from 'containers/App/sagas';
import { requestReviews } from './sagas';

type Props = {
  user: Object,
  isLoading: boolean,
  reviews: Map<string, string>,
  requestReviews: Function,
  setProfileBreadcrumbPath: Function,
}

class MyReviews extends Component {
  componentDidMount() {
    this.props.requestReviews(this.props.user.get('_id'));
    const breadcrumbPath = fromJS([
      {
        link: '/me',
        title: 'My Account',
      },
      {
        link: '',
        title: 'My Reviews',
      },
    ]);
    this.props.setProfileBreadcrumbPath(breadcrumbPath);
  }
  props: Props
  render() {
    const { reviews, isLoading } = this.props;
    return (
      <div>
        <Helmet title="My Reviews" />
        <div className="row column">
          {isLoading ?
            <div className="text-center"><Preloader height={348} /></div> :
            <MemberReviews data={reviews} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['myreviews', 'isLoading']),
  reviews: state.getIn(['myreviews', 'data']),
});

const mapDispatchToProps = (dispatch) => ({
  requestReviews: (userId) => dispatch(requestReviews(userId)),
  setProfileBreadcrumbPath: (payload) => dispatch(setProfileBreadcrumbPath(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyReviews);
