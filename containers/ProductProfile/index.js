// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { List } from 'immutable';
import { browserHistory } from 'react-router';

import Preloader from 'components/Preloader';
import Breadcrumbs from 'components/Breadcrumbs';
import ProductProfile from 'components/ProductProfile';
import { getCart, shopClient } from 'utils/shopify';

type Props = {
  params: Object,
  requestProduct: Function,
  submitComment: Function,
  openCart: Function,
  updateCart: Function,
  setMetaJson: Function,
  data: Object,
  isLoading: boolean,
  error: string,
  slug: string,
  comment: Object,
  cart: Object,
  currentUser: Object,
  params: Object,
  breadcrumbPath: List<Map<string, Object>>,
  productFollowLike: Object,
  followLikeProduct: Function,
  follows: Object,
  requestProductFollows: Function,
  likes: Object,
  requestProductLikes: Function,
  trackPurchaseButton: Function,
  trackAddProduct: Function,
};

class ProductProfileContainer extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      cart: null,
      shopifyProduct: null,
    };
    getCart().then((cart) => this.setState({ cart }));
  }
  state: {
    shopifyProduct: ?Object,
    cart: ?Object,
  }
  componentWillMount() {
    this.props.requestProduct(this.props.params.slug);
  }
  componentWillReceiveProps(newProps: Props) {
    const { data, slug, params, cart, comment } = newProps;

    const wasUpdatingComment = this.props.comment.get('isLoading');
    const isCommentUpdated = comment.get('isLoading') === false &&
      comment.get('error') === '';

    const currentProductId = this.props.data && this.props.data.get('shopifyProductId');
    const nextProductId = data && data.get('shopifyProductId');
    let productMetaJson = {};

    const wasLoadingProduct = this.props.isLoading;
    const isProductLoaded = newProps.isLoading === false && newProps.error === '';

    const wasFollowingOrLiking = this.props.productFollowLike.get('isLoading');
    const isFollowedOrLiked = newProps.productFollowLike.get('isLoading') === false && newProps.productFollowLike.get('error') === '';
    if ((wasLoadingProduct && isProductLoaded) || (wasFollowingOrLiking && isFollowedOrLiked)) {
      this.props.requestProductFollows(data.get('_id'));
      this.props.requestProductLikes(data.get('_id'));
    }

    if (data &&
      wasUpdatingComment === true &&
      isCommentUpdated === true) {
      browserHistory.push(`/${data.get('__t')}s/${data.get('slug')}/comments`);
    }

    if (wasLoadingProduct && isProductLoaded) {
      productMetaJson = {
        '@type': 'Product',
        category: data.get('category'),
        productID: data.get('slug'),
        description: data.get('description'),
        name: data.get('name'),
        brand: {
          '@type': 'Organization',
          name: data.getIn(['business', 'name']),
          email: data.getIn(['business', 'email']),
          faxNumber: data.getIn(['business', 'fax']),
          logo: data.getIn(['business', 'thumbnail']),
          description: data.getIn(['business', 'description']),
          telephone: data.getIn(['business', 'telephone']),
          url: data.getIn(['business', 'website']),
          address: {
            '@type': 'PostalAddress',
            addressLocality: data.getIn(['business', 'locations', 0, 'city']),
            addressRegion: data.getIn(['business', 'locations', 0, 'province']),
            postalCode: data.getIn(['business', 'locations', 0, 'postalCode']),
            streetAddress: data.getIn(['business', 'locations', 0, 'address']),
          },
        },
      };
      if (data.get('reviews') && data.get('reviews').size > 0) {
        productMetaJson.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: data.get('rating'),
          bestRating: 5,
          worstRating: 0,
          reviewCount: data.get('reviews').size,
        };
      }
      this.props.setMetaJson(['mainEntity'], productMetaJson);
    }

    if (params.slug !== slug) {
      this.props.requestProduct(params.slug);
    }

    if (currentProductId !== nextProductId && nextProductId) {
      shopClient.fetchProduct(data.get('shopifyProductId'))
        .then((shopifyProduct) => {
          this.setState({
            shopifyProduct,
          });
        });
    }
    if (cart.get('itemCount') !== this.props.cart.get('itemCount')) {
      getCart().then((updatedCart) => this.setState({ cart: updatedCart }));
    }
  }
  props: Props
  addToCart = (product: Object, qty: number) => {
    const { cart } = this.state;
    const cartLineItem = cart ?
      cart.lineItems.filter((item) => item.variant_id === product.selectedVariant.id)[0]
      : null;

    if (cartLineItem && cart) {
      cart.updateLineItem(cartLineItem.id, parseInt(cartLineItem.quantity, 10) + parseInt(qty, 10))
        .then((updatedCart) => this.props.updateCart(updatedCart.lineItemCount));
    } else if (cart) {
      cart.createLineItemsFromVariants({
        variant: product.selectedVariant,
        quantity: qty,
      }).then((updatedCart) => this.props.updateCart(updatedCart.lineItemCount));
    }
    this.props.openCart();
    this.props.trackAddProduct(product.title);
  }
  render() {
    const {
      data,
      isLoading,
      error,
      currentUser,
      comment,
      breadcrumbPath,
      productFollowLike,
      follows,
      likes,
    } = this.props;
    const { shopifyProduct } = this.state;
    if (isLoading) return <div className="text-center"><Preloader height={200} /></div>;
    return (
      data && error === '' ? <div>
        <Helmet title={data.get('name')} />
        <Breadcrumbs path={breadcrumbPath} />
        <ProductProfile
          data={data}
          addToCart={this.addToCart}
          shopifyProduct={shopifyProduct}
          comment={comment}
          submitComment={this.props.submitComment}
          currentUser={currentUser}
          follows={follows}
          likes={likes}
          productFollowLike={productFollowLike}
          followLikeProduct={this.props.followLikeProduct}
          trackPurchaseButton={this.props.trackPurchaseButton}
        />
      </div> :
      null
    );
  }
}

export default ProductProfileContainer;
