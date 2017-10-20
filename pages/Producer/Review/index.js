// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import BusinessReview from 'containers/Review';

import {
  requestBusinessProfile,
  requestComment,
  requestReview,
  voteReview,
  deleteReview,
  completeReviewForm,
  clearReviewForm,
} from 'containers/BusinessProfile/sagas';

import {
  requestUser,
  setMetaJson,
} from 'containers/App/sagas';

type Props = {
  params: Object,
  isLoading: boolean,
  error: string,
  business: Object,
  comment: Object,
  review: Object,
  reviewData: Object,
  requestBusinessProfile: Function,
  requestComment: Function,
  requestReview: Function,
  deleteReview: Function,
  voteReview: Function,
  currentUser: Object,
  reviewCompletion: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
  requestUser: Function,
  setMetaJson: Function,
};

class ProducerReviewPage extends Component {
  props: Props
  render() {
    const {
      params,
      isLoading,
      error,
      business,
      comment,
      review,
      reviewData,
      currentUser,
      reviewCompletion,
    } = this.props;
    return (
      <BusinessReview
        category="producer"
        slug={params.slug}
        reviewId={params.id}
        isLoading={isLoading}
        error={error}
        data={business}
        comment={comment}
        review={review}
        reviewData={reviewData}
        reviewCompletion={reviewCompletion}
        requestData={this.props.requestBusinessProfile}
        submitComment={this.props.requestComment}
        requestReview={this.props.requestReview}
        deleteReview={this.props.deleteReview}
        voteReview={this.props.voteReview}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
        currentUser={currentUser}
        requestUser={this.props.requestUser}
        setMetaJson={this.props.setMetaJson}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['profile', 'business', 'data']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  comment: state.getIn(['profile', 'comment']),
  review: state.getIn(['profile', 'review']),
  reviewData: state.getIn(['profile', 'reviewData']),
  reviewCompletion: state.getIn(['profile', 'reviewCompletion']),
});

const mapDispatchToProps = (dispatch) => ({
  requestBusinessProfile: (slug, value) => dispatch(requestBusinessProfile(slug, value)),
  requestComment: (payload, commentId) => dispatch(requestComment(payload, commentId)),
  requestReview: (id) => dispatch(requestReview(id)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: (reviewId) => dispatch(deleteReview(reviewId)),
  completeReviewForm: (path, value) => dispatch(completeReviewForm(path, value)),
  clearReviewForm: () => dispatch(clearReviewForm()),
  requestUser: () => dispatch(requestUser()),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProducerReviewPage);
