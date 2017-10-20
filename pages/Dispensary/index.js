// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import BusinessProfileContainer from 'containers/BusinessProfile';

import {
  requestBusinessProfile,
  requestComment,
  followLikeBusiness,
  requestBusinessFollows,
  requestBusinessLikes,
} from 'containers/BusinessProfile/sagas';

import { setMetaJson } from 'containers/App/sagas';

type Props = {
  params: Object,
  location: Object,
  isLoading: boolean,
  error: string,
  business: Object,
  comment: Object,
  businessFollowLike: Object,
  requestBusinessProfile: Function,
  requestComment: Function,
  followLikeBusiness: Function,
  currentUser: Object,
  follows: Object,
  likes: Object,
  breadcrumbPath: List<Map<string, Object>>,
  requestBusinessFollows: Function,
  requestBusinessLikes: Function,
  setMetaJson: Function,
  location: Object,
  children: React.Element<any>,
};

class DispensaryPage extends Component {
  props: Props
  render() {
    const {
      params,
      location,
      business,
      isLoading,
      error,
      comment,
      businessFollowLike,
      follows,
      likes,
      breadcrumbPath,
      currentUser,
    } = this.props;
    return (
      <div className="row column">
        <BusinessProfileContainer
          category="dispensary"
          slug={params.slug}
          location={location}
          business={business}
          isLoading={isLoading}
          error={error}
          comment={comment}
          businessFollowLike={businessFollowLike}
          follows={follows}
          likes={likes}
          breadcrumbPath={breadcrumbPath}
          currentUser={currentUser}
          requestBusinessProfile={this.props.requestBusinessProfile}
          requestComment={this.props.requestComment}
          followLikeBusiness={this.props.followLikeBusiness}
          requestBusinessFollows={this.props.requestBusinessFollows}
          requestBusinessLikes={this.props.requestBusinessLikes}
          setMetaJson={this.props.setMetaJson}
        />
        {this.props.children}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['profile', 'business', 'data']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  breadcrumbPath: state.getIn(['profile', 'breadcrumbPath']),
  comment: state.getIn(['profile', 'comment']),
  businessFollowLike: state.getIn(['profile', 'businessFollowLike']),
  follows: state.getIn(['profile', 'follows']),
  likes: state.getIn(['profile', 'likes']),
});

const mapDispatchToProps = (dispatch) => ({
  requestBusinessProfile: (slug, value) => dispatch(requestBusinessProfile(slug, value)),
  requestComment: (payload, commentId) => dispatch(requestComment(payload, commentId)),
  followLikeBusiness: (businessId, actionType) => dispatch(followLikeBusiness(businessId, actionType)),
  requestBusinessFollows: (businessId) => dispatch(requestBusinessFollows(businessId)),
  requestBusinessLikes: (businessId) => dispatch(requestBusinessLikes(businessId)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DispensaryPage);
