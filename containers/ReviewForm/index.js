// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';
import Breadcrumbs from 'components/Breadcrumbs';

import Review from 'components/Review';
import ProductReviewForm from 'components/ReviewForm/Product';
import BusinessReviewForm from 'components/ReviewForm/Business';
import CannabisProductReviewForm from 'components/CannabisProductReviewForm';

import Preloader from 'components/Preloader';
import NotFound from 'pages/NotFound';

type Props = {
  category: string,
  isLoading: boolean,
  error: string,
  data: Object,
  comment: Object,
  review: Object,
  reviewData: Object,
  reviewCompletion: Object,
  slug: string,
  reviewId: string,
  requestData: Function,
  submitComment: Function,
  submitReview: Function,
  requestReview: Function,
  completeReviewForm: Function,
  clearReviewForm: Function,
  currentUser: Object,
};

class ReviewFormContainer extends Component {
  componentWillMount() {
    const { slug, reviewId } = this.props;
    this.props.requestData(slug);
    if (reviewId) {
      this.props.requestReview(reviewId);
    }
  }

  props: Props
  render() {
    const {
      category,
      isLoading,
      error,
      data,
      comment,
      review,
      reviewData,
      reviewCompletion,
      slug,
      reviewId,
      currentUser,
    } = this.props;
    let categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    if (category === 'product') {
      const productCategory = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
      categoryPlural = `${productCategory}s`;
    }
    const isLoadingReviewData = reviewData.get('isLoading');
    const reviewDataError = reviewData.get('error');
    const isLoadingReview = review.get('isLoading');
    const reviewError = review.get('error');
    const title = reviewData.getIn(['data', 'title']);
    let breadcrumbPath = fromJS([
      {
        link: category === 'product' ? '/shop' : '/find',
        title: category === 'product' ? 'Shop' : 'Find',
      },
      {
        link: `/${categoryPlural}`,
        title: categoryPlural,
      },
      {
        link: `/${categoryPlural}/${slug}`,
        title: data && data.get('name'),
      },
      {
        link: `/${categoryPlural}/${slug}/reviews`,
        title: 'reviews',
      },
      {
        link: (reviewId ? `/${categoryPlural}/${slug}/reviews/${reviewId}` : ''),
        title: (reviewId ? title : 'Create Review'),
      },
    ]);
    if (reviewId) {
      breadcrumbPath = breadcrumbPath.push(fromJS({
        link: '',
        title: 'Edit',
      }));
    }

    if ((!isLoading && error !== '') || (!isLoadingReviewData && reviewDataError !== '')) {
      return (<NotFound />);
    }

    let productReviewForm = null;
    if (categoryPlural === 'products') {
      productReviewForm = (<ProductReviewForm
        submitReview={this.props.submitReview}
        isLoading={isLoadingReview}
        reviewId={reviewId}
        reviewData={fromJS({})}
        currentUser={currentUser}
        productId={data && data.get('_id')}
        error={reviewError}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
      />);
    } else {
      productReviewForm = (<CannabisProductReviewForm
        submitReview={this.props.submitReview}
        isLoading={isLoadingReview}
        reviewId={reviewId}
        reviewData={fromJS({})}
        currentUser={currentUser}
        productId={data && data.get('_id')}
        error={reviewError}
        completeReviewForm={this.props.completeReviewForm}
        clearReviewForm={this.props.clearReviewForm}
      />);
    }
    return (
      <div>
        <Helmet title={data && data.get('name')} />
        <Breadcrumbs
          path={breadcrumbPath}
        />
        {!data || (reviewId && isLoadingReviewData) ?
          <div className="text-center">
            <Preloader height={548} />
          </div> :
          <Review
            data={data}
            isLoading={isLoading}
            error={error}
            requestComment={this.props.submitComment}
            currentUser={currentUser}
            comment={comment}
            reviewCompletion={reviewCompletion}
          >
            {
              (category === 'product') ?
                productReviewForm : <BusinessReviewForm
                  category={category}
                  slug={slug}
                  submitReview={this.props.submitReview}
                  isLoading={isLoadingReview}
                  reviewId={reviewId}
                  reviewData={reviewData}
                  currentUser={currentUser}
                  completeReviewForm={this.props.completeReviewForm}
                  clearReviewForm={this.props.clearReviewForm}
                  businessId={data.get('_id')}
                  error={reviewError}
                />
            }
          </Review>
        }
      </div>
    );
  }
}

export default ReviewFormContainer;
