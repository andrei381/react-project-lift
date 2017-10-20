// @flow

import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import ReviewCount from 'components/ReviewCount';
import CommentModal from 'components/CommentModal';
import ReviewCompletion from 'components/ReviewCompletion';

import './styles.scss';

type Props = {
  data: Object,
  requestComment: Function,
  comment: Object,
  currentUser: Object,
  reviewCompletion?: Object,
  children?: React$Element<any>,
};

class Review extends Component {
  componentWillReceiveProps(newProps: Object) {
    const { data, comment } = this.props;
    const wasUpdatingComment = comment.get('isLoading');
    const isCommentUpdated = newProps.comment.get('isLoading') === false &&
      comment.get('error') === '';

    if (data && wasUpdatingComment === true &&
      isCommentUpdated === true) {
      browserHistory.push(`/${data.get('__t')}s/${data.get('slug')}/comments`);
    }
  }
  props: Props
  render() {
    const {
      data,
      comment,
      reviewCompletion,
      requestComment,
      currentUser,
      children,
    } = this.props;
    const isLoadingComment = comment.get('isLoading');
    const commentError = comment.get('error');

    const name = data.get('name');
    const reviewCount = data.get('reviews') ? data.get('reviews').size : 0;
    const topic = {
      name: data.get('name'),
      ref: data.get('_id'),
    };
    const url = window.location.href;
    const isCreateReview = url.includes('create-review');
    const category = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const slug = data && data.get('slug');
    const rating = data.get('rating');
    return (
      <div className="createReview mb-xl">
        <div className="row">
          <div className="column small-12 medium-8 large-8 large-offset-2">
            <div className="row align-middle mb-sm">
              <div className="column">
                <h1 className="c-secondary t-capitalize">{name}</h1>
              </div>
              <div className="column shrink">
                { currentUser && !isCreateReview &&
                  <div className="shrink column">
                    <CommentModal
                      topic={topic}
                      url={url}
                      requestComment={requestComment}
                      isLoading={isLoadingComment}
                      error={commentError}
                      linkText={'Comment'}
                      textIsButton
                    />
                  </div>
                }
              </div>
            </div>
            <div className="createReview__infoSection row mb-md">
              <div className="column">
                <div className="row align-middle mb-xxl">
                  <ReviewCount
                    className="createReview__rating"
                    reviewCount={reviewCount}
                    ratingsAverage={rating}
                    to={`/${categoryPlural}/${slug}/reviews`}
                  />
                </div>
              </div>
            </div>
            {children}
          </div>
          {false && <div className="column small-12 medium-4 large-3 large-offset-1">
            {
              reviewCompletion && <div className="mb-lg">
                <ReviewCompletion
                  reviewCompletion={reviewCompletion}
                />
              </div>
            }
            <div className="fs-mx c-green mb-mn">New to Lift Rewards?</div>
            <div className="mb-lg">Writing a high quality review will earn you more Lift Points, which you can use to unlock special Rewards, including discounts at licensed producers or cannabis vaporizers and accessories from our online store.</div>
            <Link
              className="button"
              to="/rewards"
            >
              Learn More
            </Link>
          </div>}
        </div>
      </div>
    );
  }
}

export default Review;
