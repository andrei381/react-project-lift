// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { fromJS, List } from 'immutable';
import { connect } from 'react-redux';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import CreateReview from 'components/CreateReview';

import { requestProducts, trackPageStep2 } from 'pages/CreateReview/sagas';

import CreateReviewBanner from 'images/banners/create-a-review.jpg';

type Props = {
  products: List<Map<string, Object>>,
  isLoading: boolean,
  error: Object,
  pages: number,
  requestProducts: Function,
  trackPageStep2: Function,
}

class CreateReviewPage extends Component {
  props: Props
  render() {
    const { products, isLoading, error, pages } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Create a review',
      },
    ]);
    return (
      <div>
        <Helmet title="Create a review" />
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={CreateReviewBanner}
          title="Create a review"
          titleLarge
          subtitle="Select a strain to get started with leaving a review."
        />
        <CreateReview
          requestProducts={this.props.requestProducts}
          trackPageStep2={this.props.trackPageStep2}
          products={products}
          isLoading={isLoading}
          error={error}
          pages={pages}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.getIn(['createReview', 'data', 'hits']),
  isLoading: state.getIn(['createReview', 'isLoading']),
  error: state.getIn(['createReview', 'error']),
  pages: state.getIn(['createReview', 'data', 'pages']),
});

const mapDispatchToProps = (dispatch) => ({
  requestProducts: (path, keyword) => dispatch(requestProducts(path, keyword)),
  trackPageStep2: (business, product) => dispatch(trackPageStep2(business, product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateReviewPage);
