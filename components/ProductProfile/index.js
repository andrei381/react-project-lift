// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import type { Map } from 'immutable';
import cx from 'classnames';

import Button from 'components/Button';
import ReviewCount from 'components/ReviewCount';
import ProductPrice from 'components/ProductPrice';
import ProductAction from 'components/ProductAction';
import ProductGallery from 'components/ProductGallery';
import CustomSelect from 'components/CustomSelect';
import CommentModal from 'components/CommentModal';
import RequireAuth from 'components/RequireAuth';

import transformOptions from 'utils/transformOptions';

import ProductCategory from 'components/ProductCategory';
import Cannabinoids from 'components/Cannabinoids';

import IconPlus from 'images/sprite/plus.svg';
import IconHeart from 'images/sprite/heart.svg';
import './styles.scss';


const quantities = ['1', '2', '3', '4', '5'];

type Props = {
  data: Map<string, any>,
  addToCart: Function,
  shopifyProduct: ?Object,
  submitComment: Function,
  followLikeProduct: Function,
  comment: Object,
  currentUser: Object,
  follows: Object,
  likes: Object,
};
type State = {
  quantity: string,
  product: ?Object,
};

class ProductProfile extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      quantity: '1',
      product: props.shopifyProduct,
    };
  }
  state: State
  componentWillReceiveProps(newProps: Object) {
    const { shopifyProduct } = newProps;
    this.setState({
      product: shopifyProduct,
    });
  }
  followLikeProduct = (actionType: string) => {
    this.props.followLikeProduct(this.props.data.get('_id'), actionType);
  }
  props: Props
  render() {
    const { data, addToCart, comment, submitComment, follows, likes, currentUser } = this.props;
    const { quantity, product } = this.state;

    const name = data.get('name');
    const photos = data.get('photos');
    const producer = data.getIn(['business', 'name']);
    const businessCategory = data.getIn(['business', '__t']);
    const businessCategoryPlural = businessCategory && (businessCategory.toLowerCase() === 'dispensary' ? 'dispensaries' : `${businessCategory.toLowerCase()}s`);
    const businessSlug = data.getIn(['business', 'slug']);
    const isLoadingComment = comment.get('isLoading');
    const commentError = comment.get('error');
    const topic = {
      name,
      ref: data.get('_id'),
    };
    const productType = data.get('__t');
    const categoryPlural = productType ? `${productType.toLowerCase()}s` : 'products';
    const slug = data.get('slug');
    const url = window.location.href;
    const imgContainerClass = this.props.shopifyProduct ? 'large-6' : 'large-4';
    const contentContainerClass = this.props.shopifyProduct ? 'large-6' : 'large-8';
    const price = data.getIn(['variants', 0, 'price']);
    const priceInfo = (
      <div>
        <span className="productProfile__price column">
          <ProductPrice
            price={price}
            unit={data.getIn(['variants', '0', 'doseUnit'])}
            doseAmount={data.getIn(['variants', '0', 'doseAmount'])}
          />
        </span>
      </div>
    );
    return (
      <div className="productProfile row">
        <div className={cx('small-12 medium-6 columns', imgContainerClass)}>
          {photos.size ?
            <ProductGallery
              data={photos}
              title={name}
            /> :
            <div
              className="productProfile__thumbnail mb-md"
              style={{ backgroundImage: `url(${data.get('thumbnail')})` }}
            />
          }
        </div>
        <div className={cx('small-12 medium-6 columns', contentContainerClass)}>
          <h1 className="c-secondary">{name}</h1>
          {
            producer && businessCategoryPlural && businessSlug &&
              <div className="productProfile__producerName">
                <Link
                  className="productProfile__producerNameLink"
                  to={`/${businessCategoryPlural}/${businessSlug}`}
                >
                  by {producer}
                </Link>
              </div>
          }
          <div className="row">
            <div className="shrink column">
              <ProductCategory data={data.get('category')} />
            </div>
            <div className="shrink column">
              <Cannabinoids
                thc={data.get('thc')}
                cbd={data.get('cbd')}
              />
            </div>
          </div>
          <div className="row align-middle mb-md">
            <div className="column small-12 medium-expand">
              <ReviewCount
                reviewCount={data.get('reviews').size}
                ratingsAverage={data.get('rating')}
                to={`/${categoryPlural}/${slug}/reviews`}
              />
            </div>
            <div className="shrink column">
              <Link
                to={`/${categoryPlural}/${slug}/create-review`}
                className="button secondary"
              >Review</Link>
            </div>
            { currentUser ?
              <div className="shrink column">
                <CommentModal
                  topic={topic}
                  url={url}
                  requestComment={submitComment}
                  isLoading={isLoadingComment}
                  error={commentError}
                  linkText={'Comment'}
                  linkStyle={'productProfile__commentButton'}
                  textIsButton
                />
              </div> : <div className="shrink column">
                <RequireAuth toDo="add comments">
                  <Button>Comment</Button>
                </RequireAuth>
              </div>
            }
          </div>
          <div className="row align-middle mb-md">
            <div className="column">
              {!!price && priceInfo}
            </div>
            <div className="shrink column right">
              {
                currentUser ?
                  <ProductAction
                    glyph={IconPlus}
                    title="Follow"
                    count={follows.get('count')}
                    onClick={() => this.followLikeProduct('follow')}
                  /> : <RequireAuth toDo="follow product">
                    <ProductAction
                      glyph={IconPlus}
                      title="Follow"
                      count={follows.get('count')}
                    />
                  </RequireAuth>
              }
            </div>
            <div className="shrink column">
              {
                currentUser ?
                  <ProductAction
                    glyph={IconHeart}
                    title="Like"
                    count={likes.get('count')}
                    onClick={() => this.followLikeProduct('like')}
                  /> : <RequireAuth toDo="like product">
                    <ProductAction
                      glyph={IconHeart}
                      title="Like"
                      count={likes.get('count')}
                    />
                  </RequireAuth>
              }
            </div>
          </div>
          {product && product.options.map((option) => {
            if (option.values.length <= 1) {
              // products with no variants should not show the dropdown UI
              // see related: `var variant_title` and 'Default Title'
              return '';
            }
            return (
              <div
                className="row align-middle mb-sm"
                key={option.name}
              >
                <div className="large-3 columns npr mb-sm"><label htmlFor={option.name}>{option.name}</label></div>
                <div className=" large-9 columns  end mb-sm">
                  <CustomSelect
                    className="large"
                    name={option.name}
                    options={transformOptions(option.values)}
                    clearable={false}
                    value={option.selected}
                    onChange={(e) => {
                      product.options.filter((filteredOption) => filteredOption.name === option.name)[0]
                        .selected = e.value;
                      this.setState({ product });
                    }}
                  />
                </div>
              </div>
            );
          })}
          {product && <span>
            <div className="row align-middle">
              <div className="large-3 columns npr mb-sm"><label htmlFor="qty">Quantity</label></div>
              <div className=" large-9 columns  end mb-md">
                <CustomSelect
                  className="large"
                  name="qty"
                  options={transformOptions(quantities)}
                  value={quantity}
                  clearable={false}
                  onChange={(e) => this.setState({
                    quantity: e.value,
                  })}
                />
              </div>
            </div>
            <Button
              className="productProfile__addToBagButton expanded"
              onClick={() => addToCart(product, quantity)}
            >Add to bag</Button>
          </span>
          }
        </div>
      </div>
    );
  }
}

export default ProductProfile;
