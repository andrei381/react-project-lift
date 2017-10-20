// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { generate } from 'shortid';
import { fromJS, List } from 'immutable';

import ReviewList from 'components/ReviewList';
import Pagination from 'components/Pagination';
import ReviewSort from 'components/Sort';
import BorderedTitle from 'components/BorderedTitle';
import Tab from 'components/Tab';
import ButtonGroup from 'components/ButtonGroup';
import Select from 'components/Select';

import {
  requestBusinessReviews,
  voteReview,
  deleteReview,
  sortReview,
  setBreadcrumbPath,
} from 'containers/BusinessProfile/sagas';

import { setMetaJson } from 'containers/App/sagas';

import { REVIEW_SORT_OPTIONS } from 'containers/constants';

type Props = {
  category: string,
  isLoading: boolean,
  isLoadingReviews: boolean,
  business: Object,
  reviews: List<Map<string, Object>>,
  reviewPages: number,
  reviewsSortBy: string,
  review: Object,
  reviewVote: Object,
  slug: string,
  requestBusinessReviews: Function,
  deleteReview: Function,
  voteReview: Function,
  sortReview: Function,
  currentUser: Object,
  setBreadcrumbPath: Function,
  setMetaJson: Function,
};

class BusinessReviewContainer extends Component {
  componentWillMount() {
    const { business } = this.props;
    if (business && business.get('id')) {
      this.props.requestBusinessReviews(business.get('id'));
      this.setBreadcrumbPath(business);
    }
  }

  componentWillReceiveProps(newProps) {
    const { business, reviewVote, review, reviewsSortBy, isLoadingReviews } = this.props;

    let reviewMeta = [];

    const wasLoadingProfile = this.props.isLoading;
    const isProfileLoaded = newProps.isLoading === false &&
      !!newProps.business &&
      !!newProps.business.get('id');

    const wasVotingReview = reviewVote.get('isLoading');
    const isReviewVoted = newProps.reviewVote.get('isLoading') === false &&
      newProps.reviewVote.get('error') === '';

    const wasUpdatingReview = review.get('isLoading');
    const isReviewUpdated = newProps.review.get('isLoading') === false &&
      newProps.review.get('error') === '';


    if (newProps.isLoadingReviews === false &&
      wasLoadingProfile &&
      isProfileLoaded) {
      this.props.requestBusinessReviews(newProps.business.get('id'));
      this.setBreadcrumbPath(newProps.business);
    }

    if (isLoadingReviews &&
      !newProps.isLoadingReviews) {
      reviewMeta = newProps.reviews.toJS().map((item) => {
        let author = '';
        if (item.user && item.user.fullName) {
          author = item.user.fullName;
        } else if (item.user) {
          author = item.user.username;
        } else {
          author = item.guest.name;
        }
        return {
          '@type': 'Review',
          author,
          datePublished: item.createdOn,
          reviewBody: item.message,
          name: item.title,
          reviewRating: {
            '@type': 'Rating',
            bestRating: 5,
            ratingValue: item.rating,
            worstRating: 0,
          },
        };
      });
      this.props.setMetaJson(['mainEntity', 'review'], reviewMeta);
    }

    if (business &&
      wasVotingReview &&
      isReviewVoted) {
      this.props.requestBusinessReviews(business.get('id'));
    }

    if (business &&
      wasUpdatingReview === true &&
      isReviewUpdated) {
      this.props.requestBusinessReviews(business.get('id'));
    }

    if (newProps.reviewsSortBy !== reviewsSortBy) {
      this.props.requestBusinessReviews(business.get('id'));
    }
  }

  setBreadcrumbPath = (data: Object) => {
    const { slug, category } = this.props;
    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const breadcrumbPath = fromJS([
      {
        link: '/find',
        title: 'Find',
      },
      {
        link: `/${categoryPlural}`,
        title: categoryPlural,
      },
      {
        link: `/${categoryPlural}/${slug}`,
        title: (data ? data.get('name') : ''),
      },
      {
        link: '',
        title: 'Reviews',
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  }

  props: Props
  render() {
    const {
      category,
      business,
      reviews,
      reviewPages,
      reviewsSortBy,
      isLoadingReviews,
      slug,
      currentUser,
    } = this.props;

    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const baseUrl = `/${categoryPlural}/${slug}`;

    const businessId = business.get('id');

    let reviewsCount = 0;
    if (reviews) {
      reviewsCount = reviews.size;
    }

    return (
      <div>
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={`${baseUrl}/about`}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          <Tab to={`${baseUrl}/comments`}>Comments</Tab>
          <Tab to={`${baseUrl}/products`}>Products</Tab>
        </ButtonGroup>
        <div className="row">
          <div className="column">
            <Select
              className="mb-lg show-for-small-only b-primary"
              value={'Reviews'}
              onChange={(e) => {
                if (e.target.value === 'About') {
                  browserHistory.push(baseUrl);
                } else {
                  browserHistory.push(`${baseUrl}/${e.target.value.toLowerCase()}`);
                }
              }}
            >
              {['About', 'Reviews', 'Comments', 'Products'].map((item) => (
                <option
                  key={generate()}
                  value={item}
                >{item}</option>
              ))}
            </Select>
          </div>
        </div>
        <BorderedTitle>Showing {reviewsCount} of {business && business.get('reviews') && business.get('reviews').size} reviews</BorderedTitle>
        <ReviewSort
          options={REVIEW_SORT_OPTIONS}
          value={reviewsSortBy}
          sort={this.props.sortReview}
        />
        <ReviewList
          data={reviews}
          category={category}
          slug={slug}
          isLoading={isLoadingReviews}
          currentUser={currentUser}
          deleteReview={this.props.deleteReview}
          voteReview={this.props.voteReview}
        />

        <Pagination
          initialPage={1}
          pageCount={reviewPages}
          onPageChange={(e) => this.props.requestBusinessReviews(businessId, ['page'], e)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['profile', 'business', 'data']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  reviews: state.getIn(['profile', 'reviews', 'data', 'hits']),
  reviewPages: state.getIn(['profile', 'reviews', 'data', 'pages']),
  reviewsSortBy: state.getIn(['profile', 'reviews', 'model', 'sortBy']),
  comment: state.getIn(['profile', 'comment']),
  review: state.getIn(['profile', 'review']),
  isLoadingReviews: state.getIn(['profile', 'reviews', 'isLoading']),
  reviewVote: state.getIn(['profile', 'reviewVote']),
  businessFollowLike: state.getIn(['profile', 'businessFollowLike']),
  follows: state.getIn(['profile', 'follows']),
  likes: state.getIn(['profile', 'likes']),
});

const mapDispatchToProps = (dispatch) => ({
  requestBusinessReviews: (category, id, value) => dispatch(requestBusinessReviews(category, id, value)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: (reviewId) => dispatch(deleteReview(reviewId)),
  sortReview: (sortBy) => dispatch(sortReview(sortBy)),
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessReviewContainer);
