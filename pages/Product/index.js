// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import ProductProfileContainer from 'containers/ProductProfile';
import {
  requestProduct,
  submitComment,
  followLikeProduct,
  requestProductFollows,
  requestProductLikes,
  trackPurchaseButton,
} from 'containers/Product/sagas';
import { openCart, updateCart, trackAddProduct, setMetaJson } from 'containers/App/sagas';

type Props = {
  params: Object,
  requestProduct: Function,
  submitComment: Function,
  openCart: Function,
  updateCart: Function,
  followLikeProduct: Function,
  requestProductFollows: Function,
  requestProductLikes: Function,
  trackPurchaseButton: Function,
  setMetaJson: Function,
  trackAddProduct: Function,
  data: Object,
  isLoading: boolean,
  error: string,
  slug: string,
  comment: Object,
  cart: Object,
  currentUser: Object,
  children: React.Element<any>,
  breadcrumbPath: List<Map<string, Object>>,
  productFollowLike: Object,
  follows: Object,
  likes: Object,
};

class ProductPage extends Component {
  props: Props
  render() {
    const {
      data,
      currentUser,
      comment,
      isLoading,
      error,
      params,
      cart,
      slug,
      breadcrumbPath,
      productFollowLike,
      follows,
      likes,
    } = this.props;
    return (
      <div className="row column">
        <ProductProfileContainer
          data={data}
          comment={comment}
          requestProduct={this.props.requestProduct}
          submitComment={this.props.submitComment}
          setMetaJson={this.props.setMetaJson}
          currentUser={currentUser}
          params={params}
          slug={slug}
          isLoading={isLoading}
          error={error}
          cart={cart}
          openCart={this.props.openCart}
          updateCart={this.props.updateCart}
          breadcrumbPath={breadcrumbPath}
          productFollowLike={productFollowLike}
          followLikeProduct={this.props.followLikeProduct}
          follows={follows}
          requestProductFollows={this.props.requestProductFollows}
          likes={likes}
          requestProductLikes={this.props.requestProductLikes}
          trackPurchaseButton={this.props.trackPurchaseButton}
          trackAddProduct={this.props.trackAddProduct}
        />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  data: state.getIn(['product', 'data', 'hits', 0]),
  breadcrumbPath: state.getIn(['product', 'breadcrumbPath']),
  isLoading: state.getIn(['product', 'isLoading']),
  error: state.getIn(['product', 'error']),
  slug: state.getIn(['product', 'slug']),
  comment: state.getIn(['product', 'comment']),
  cart: state.getIn(['app', 'cart']),
  productFollowLike: state.getIn(['product', 'productFollowLike']),
  follows: state.getIn(['product', 'follows']),
  likes: state.getIn(['product', 'likes']),
});

const mapDispatchToProps = (dispatch) => ({
  requestProduct: (slug) => dispatch(requestProduct(slug)),
  submitComment: (payload, commentId) => dispatch(submitComment(payload, commentId)),
  followLikeProduct: (productId, actionType) => dispatch(followLikeProduct(productId, actionType)),
  requestProductFollows: (productId) => dispatch(requestProductFollows(productId)),
  requestProductLikes: (productId) => dispatch(requestProductLikes(productId)),
  trackPurchaseButton: (business, product) => dispatch(trackPurchaseButton(business, product)),
  openCart: () => dispatch(openCart()),
  trackAddProduct: (product) => dispatch(trackAddProduct(product)),
  updateCart: (itemCount) => dispatch(updateCart(itemCount)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
