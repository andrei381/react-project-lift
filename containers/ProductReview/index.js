// @flow

import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import ReviewItem from 'components/ReviewList/ReviewItem';
import CannabisProductReviewItem from 'components/ReviewList/CannabisProductReviewItem';
import ProductReviewForm from 'components/ReviewForm/Product';
import CannabisProductReviewForm from 'components/CannabisProductReviewForm';

import {
  requestReview,
  deleteReview,
  voteReview,
  submitReview,
  setBreadcrumbPath,
  completeReviewForm,
  clearReviewForm,
} from 'containers/Product/sagas';

import {
  requestUser,
  setMetaJson,
} from 'containers/App/sagas';

type Props = {
  category: string,
  params: Object,
  product: Object,
  isLoading: boolean,
  review: Object,
  reviewVote: Object,
  reviewData: Object,
  currentUser: Object,
  submitReview: Function,
  requestReview: Function,
  deleteReview: Function,
  voteReview: Function,
  setBreadcrumbPath: Function,
  completeReviewForm: Function,
  clearReviewForm: Function,
  replace: Function,
  requestUser: Function,
  setMetaJson: Function,
};

class ProductReviewContainer extends Component {
  componentWillMount() {
    const { params, product, reviewData, currentUser } = this.props;
    if (currentUser) {
      this.props.requestUser();
    }
    if (product && params.id) {
      if (!reviewData.get('data').get('id') || reviewData.get('data').get('id') !== params.id) {
        this.props.requestReview(params.id);
      } else {
        this.setBreadcrumbPath(reviewData);
      }
    }
  }
  componentWillReceiveProps(newProps: Object) {
    const { category, params, product, isLoading, review, reviewVote, reviewData } = this.props;

    const wasLoadingProduct = this.props.isLoading;
    const isProductLoaded = isLoading === false &&
      !!product &&
      !!product.get('id');
    if (wasLoadingProduct &&
      isProductLoaded) {
      this.props.requestReview(params.id);
    }

    const wasReviewDataLoading = reviewData.get('isLoading');
    const isReviewDataLoaded = newProps.reviewData.get('isLoading') === false &&
      newProps.reviewData.get('error') === '';

    let reviewMetaJson = {};

    if (product &&
      wasReviewDataLoading &&
      isReviewDataLoaded) {
      this.setBreadcrumbPath(newProps.reviewData);
      this.props.completeReviewForm(['rating'], true);
      this.props.completeReviewForm(['title'], true);
      this.props.completeReviewForm(['message'], true);

      let author = '';
      if (newProps.reviewData.getIn(['data', 'user']) && newProps.reviewData.getIn(['data', 'user', 'fullName'])) {
        author = newProps.reviewData.getIn(['data', 'user', 'fullName']);
      } else if (newProps.reviewData.getIn(['data', 'user'])) {
        author = newProps.reviewData.getIn(['data', 'user', 'username']);
      } else {
        author = newProps.reviewData.getIn(['data', 'guest', 'name']);
      }
      reviewMetaJson = {
        '@type': 'Review',
        author,
        datePublished: newProps.reviewData.getIn(['data', 'createdOn']),
        reviewBody: newProps.reviewData.getIn(['data', 'message']),
        name: newProps.reviewData.getIn(['data', 'title']),
        reviewRating: {
          '@type': 'Rating',
          bestRating: 5,
          ratingValue: newProps.reviewData.getIn(['data', 'rating']),
          worstRating: 0,
        },
        itemReviewed: {
          '@type': 'Product',
          category: product.get('category'),
          productID: product.get('slug'),
          description: product.get('description'),
          name: product.get('name'),
          brand: {
            '@type': 'Organization',
            name: product.getIn(['business', 'name']),
            email: product.getIn(['business', 'email']),
            faxNumber: product.getIn(['business', 'fax']),
            logo: product.getIn(['business', 'thumbnail']),
            description: product.getIn(['business', 'description']),
            telephone: product.getIn(['business', 'telephone']),
            url: product.getIn(['business', 'website']),
            address: {
              '@type': 'PostalAddress',
              addressLocality: product.getIn(['business', 'locations', 0, 'city']),
              addressRegion: product.getIn(['business', 'locations', 0, 'province']),
              postalCode: product.getIn(['business', 'locations', 0, 'postalCode']),
              streetAddress: product.getIn(['business', 'locations', 0, 'address']),
            },
          },
        },
      };
      this.props.setMetaJson(['mainEntity'], reviewMetaJson);
    }

    const wasUpdatingReview = review.get('isLoading');
    const isReviewUpdated = newProps.review.get('isLoading') === false &&
      newProps.review.get('error') === '';

    if (product &&
      wasUpdatingReview &&
      isReviewUpdated) {
      if (category === 'view') {
        this.props.replace(`/products/${params.slug}/reviews`);
      } else {
        this.props.requestReview(params.id);
      }
    }

    const wasVotingReview = reviewVote && reviewVote.get('isLoading');
    const isVoteUpdated = reviewVote && newProps.reviewVote.get('isLoading') === false &&
      newProps.reviewVote.get('error') === '';

    if (product &&
      wasVotingReview &&
      isVoteUpdated) {
      this.props.requestReview(params.id);
    }
  }
  setBreadcrumbPath = (reviewData: Object) => {
    const { category, params, product } = this.props;
    let title = reviewData.getIn(['data', 'title']);
    if (!title) {
      title = params.id;
    }
    const productCategory = product && product.get('__t') ? product.get('__t').toLowerCase() : 'product';
    const breadcrumbPath = [
      {
        link: '/find',
        title: 'Find',
      },
      {
        link: `/${productCategory}s`,
        title: `${productCategory}s`,
      },
      {
        link: `/${productCategory}s/${params.slug}`,
        title: product && product.get('name'),
      },
      {
        link: `/${productCategory}s/${params.slug}/reviews`,
        title: 'reviews',
      },
    ];
    if (category === 'view') {
      breadcrumbPath.push({
        link: '',
        title,
      });
    } else {
      breadcrumbPath.push({
        link: `/${productCategory}s/${params.slug}/reviews/${params.id}`,
        title,
      });
      breadcrumbPath.push({
        link: '',
        title: 'Edit',
      });
    }
    this.props.setBreadcrumbPath(fromJS(breadcrumbPath));
  }
  props: Props
  render() {
    const {
      category,
      params,
      product,
      review,
      reviewData,
      currentUser,
    } = this.props;
    const currentUserId = currentUser && currentUser.get('_id');
    const isLoadingReview = review.get('isLoading');
    const reviewError = review.get('error');
    const productCategory = product && product.get('__t') ? product.get('__t').toLowerCase() : 'product';
    if (category === 'view') {
      return (
        <div>
          {
            productCategory === 'product' ? <ReviewItem
              category={productCategory}
              slug={params.slug}
              data={reviewData.get('data')}
              currentUserId={currentUserId}
              voteReview={this.props.voteReview}
              deleteReview={this.props.deleteReview}
            /> : <CannabisProductReviewItem
              category={productCategory}
              slug={params.slug}
              data={reviewData.get('data')}
              currentUserId={currentUserId}
              voteReview={this.props.voteReview}
              deleteReview={this.props.deleteReview}
            />
          }
        </div>
      );
    }
    let productReviewForm = null;
    if (productCategory === 'product') {
      productReviewForm = (<ProductReviewForm
        submitReview={this.props.submitReview}
        isLoading={isLoadingReview}
        reviewId={params.id}
        reviewData={reviewData}
        currentUser={currentUser}
        productId={product && product.get('_id')}
        error={reviewError}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
      />);
    } else {
      productReviewForm = (<CannabisProductReviewForm
        submitReview={this.props.submitReview}
        isLoading={isLoadingReview}
        reviewId={params.id}
        reviewData={reviewData}
        currentUser={currentUser}
        productId={product && product.get('_id')}
        error={reviewError}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
      />);
    }
    return (
      <div>
        {
          reviewData.get('data').get('id') ? productReviewForm : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  product: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  review: state.getIn(['product', 'review']),
  reviewVote: state.getIn(['product', 'reviewVote']),
  reviewData: state.getIn(['product', 'reviewData']),
  currentUser: state.getIn(['app', 'user']),
});

const mapDispatchToProps = (dispatch) => ({
  requestReview: (id) => dispatch(requestReview(id)),
  voteReview: (reviewId, type) => dispatch(voteReview(reviewId, type)),
  deleteReview: (reviewId) => dispatch(deleteReview(reviewId)),
  submitReview: (payload, reviewId) => dispatch(submitReview(payload, reviewId)),
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
  replace: (path) => dispatch(replace(path)),
  completeReviewForm: (path, value) => dispatch(completeReviewForm(path, value)),
  clearReviewForm: () => dispatch(clearReviewForm()),
  requestUser: () => dispatch(requestUser()),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductReviewContainer);
