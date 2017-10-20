// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import { generate } from 'shortid';

import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/Tab';
import BorderedTitle from 'components/BorderedTitle';
import Pagination from 'components/Pagination';
import ReviewList from 'components/ReviewList';
import ReviewSort from 'components/Sort';
import Select from 'components/Select';

import { setMetaJson } from 'containers/App/sagas';

import {
  requestProductReviews,
  deleteReview,
  voteReview,
  sortReview,
  setBreadcrumbPath,
} from 'containers/Product/sagas';

import { REVIEW_SORT_OPTIONS } from 'containers/constants';

type Props = {
  params: Object,
  requestProductReviews: Function,
  deleteReview: Function,
  voteReview: Function,
  sortReview: Function,
  setMetaJson: Function,
  data: Object,
  isLoading: boolean,
  slug: string,
  reviewsData: Object,
  reviewsPages: number,
  reviewsLoading: boolean,
  review: Object,
  reviewVote: Object,
  currentUser: Object,
  reviewsSortBy: string,
  setBreadcrumbPath: Function,
};

class ProductReviewsPage extends Component {
  componentWillMount() {
    const { data } = this.props;
    if (data) {
      this.props.requestProductReviews(data.get('_id'));
      this.setBreadcrumbPath(data);
    }
  }
  componentWillReceiveProps(newProps) {
    const { isLoading, data, review, reviewsLoading, reviewVote, reviewsSortBy, reviewsData } = newProps;

    let reviewMeta = [];

    const productId = data ? data.get('_id') : null;
    const wasUpdatingReview = this.props.review.get('isLoading');
    const isReviewUpdated = review.get('isLoading') === false &&
      review.get('error') === '';

    const wasVotingReview = this.props.reviewVote.get('isLoading');
    const isReviewVoted = reviewVote.get('isLoading') === false &&
      reviewVote.get('error') === '';

    const wasLoadingProduct = this.props.isLoading;
    const isProductLoaded = isLoading === false &&
      !!data &&
      !!data.get('_id');
    if (!reviewsLoading &&
      wasLoadingProduct &&
      isProductLoaded) {
      this.props.requestProductReviews(data.get('_id'));
      this.setBreadcrumbPath(data);
    }

    if (!reviewsLoading &&
      this.props.reviewsLoading) {
      reviewMeta = reviewsData.toJS().map((item) => {
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

    if (reviewsSortBy !== this.props.reviewsSortBy) {
      this.props.requestProductReviews(data.get('_id'));
    }

    if (data &&
      wasUpdatingReview === true &&
      isReviewUpdated === true) {
      this.props.requestProductReviews(productId, ['page'], 1);
    }

    if (data &&
      wasVotingReview === true &&
      isReviewVoted === true) {
      this.props.requestProductReviews(productId, ['page'], 1);
    }
  }
  setBreadcrumbPath = (data: Object) => {
    const { slug } = this.props;
    const category = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const breadcrumbPath = fromJS([
      {
        link: '/shop',
        title: 'Shop',
      },
      {
        link: `/${category}s`,
        title: `${category}s`,
      },
      {
        link: `/${category}s/${slug}`,
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
      data,
      currentUser,
      reviewsData,
      reviewsPages,
      reviewsLoading,
      slug,
      reviewsSortBy,
    } = this.props;
    const productId = data ? data.get('_id') : null;
    let reviewsCount = 0;
    if (reviewsData) {
      reviewsCount = reviewsData.size;
    }
    const category = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const baseUrl = `/${category}s/${this.props.params.slug}`;
    return (
      <div className="mb-xl">
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={`${baseUrl}/about`}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          <Tab to={`${baseUrl}/comments`}>Comments</Tab>
        </ButtonGroup>
        <Select
          className="mb-lg show-for-small-only b-primary"
          value={'Reviews'}
          onChange={(e) => browserHistory.push(`${baseUrl}/${e.target.value.toLowerCase()}`)}
        >
          {['About', 'Reviews', 'Comments'].map((item) => (
            <option
              key={generate()}
              value={item}
            >{item}</option>
          ))}
        </Select>
        <BorderedTitle>Showing {reviewsCount} of {data && data.get('reviews').size} reviews</BorderedTitle>
        <ReviewSort
          options={REVIEW_SORT_OPTIONS}
          value={reviewsSortBy}
          sort={this.props.sortReview}
        />
        <section>
          <ReviewList
            data={reviewsData}
            category={category}
            slug={slug}
            isLoading={reviewsLoading}
            currentUser={currentUser}
            deleteReview={this.props.deleteReview}
            voteReview={this.props.voteReview}
            review={fromJS({})}
          />
        </section>
        <Pagination
          initialPage={1}
          pageCount={reviewsPages}
          onPageChange={(e) => this.props.requestProductReviews(productId, ['page'], e)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  data: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  slug: state.getIn(['product', 'slug']),
  reviewsData: state.getIn(['product', 'reviews', 'data', 'hits']),
  reviewsPages: state.getIn(['product', 'reviews', 'data', 'pages']),
  reviewsLoading: state.getIn(['product', 'reviews', 'isLoading']),
  reviewsSortBy: state.getIn(['product', 'reviews', 'model', 'sortBy']),
  review: state.getIn(['product', 'review']),
  reviewVote: state.getIn(['product', 'reviewVote']),
  cart: state.getIn(['app', 'cart']),
});

const mapDispatchToProps = (dispatch) => ({
  requestProductReviews: (id, path, value) => dispatch(requestProductReviews(id, path, value)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: (reviewId) => dispatch(deleteReview(reviewId)),
  sortReview: (sortBy) => dispatch(sortReview(sortBy)),
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductReviewsPage);
