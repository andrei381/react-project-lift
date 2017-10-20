// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { connect } from 'react-redux';
import { List } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import Review from 'components/Review';
import Preloader from 'components/Preloader';

import {
  requestProduct,
  submitComment,
} from 'containers/Product/sagas';

type Props = {
  params: Object,
  product: Object,
  comment: Object,
  requestProduct: Function,
  submitComment: Function,
  currentUser: Object,
  children: React.Element<any>,
  breadcrumbPath: List<Map<string, Object>>,
  reviewCompletion: Object,
};

class ProductReviewPage extends Component {
  componentWillMount() {
    const { params, product } = this.props;
    if (!product) {
      this.props.requestProduct(params.slug);
    }
  }
  props: Props
  render() {
    const {
      product,
      comment,
      currentUser,
      breadcrumbPath,
      reviewCompletion,
    } = this.props;

    if (!product) return <div className="text-center"><Preloader height={548} /></div>;
    return (
      <div>
        <Helmet title={product && product.get('name')} />
        <Breadcrumbs path={breadcrumbPath} />
        <Review
          data={product}
          requestComment={this.props.submitComment}
          currentUser={currentUser}
          comment={comment}
          reviewCompletion={reviewCompletion}
        >
          {this.props.children}
        </Review>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  product: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  error: state.getIn(['product', 'error']),
  breadcrumbPath: state.getIn(['product', 'breadcrumbPath']),
  comment: state.getIn(['product', 'comment']),
  review: state.getIn(['product', 'review']),
  reviewData: state.getIn(['product', 'reviewData']),
  reviewCompletion: state.getIn(['product', 'reviewCompletion']),
});

const mapDispatchToProps = (dispatch) => ({
  requestProduct: (slug) => dispatch(requestProduct(slug)),
  submitComment: (payload, commentId) => dispatch(submitComment(payload, commentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductReviewPage);
