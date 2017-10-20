// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import { browserHistory } from 'react-router';
import { generate } from 'shortid';

import ProductsList from 'components/ProductsList';
import Pagination from 'components/Pagination';
import BorderedTitle from 'components/BorderedTitle';
import Tab from 'components/Tab';
import ButtonGroup from 'components/ButtonGroup';
import Select from 'components/Select';

import {
  requestBusinessProfile,
  requestBusinessProducts,
  requestComment,
  followLikeBusiness,
  requestBusinessFollows,
  requestBusinessLikes,
  setBreadcrumbPath,
} from 'containers/BusinessProfile/sagas';

type Props = {
  category: string,
  isLoading: boolean,
  business: Object,
  products: List<Map<string, Object>>,
  productPages: number,
  slug: string,
  requestBusinessProducts: Function,
  setBreadcrumbPath: Function,
};

class BusinessProductContainer extends Component {
  componentWillMount() {
    const { business } = this.props;
    if (business && business.get('id')) {
      this.props.requestBusinessProducts(business.get('id'));
      this.setBreadcrumbPath(business);
    }
  }

  componentWillReceiveProps(newProps) {
    const wasLoadingProfile = this.props.isLoading;
    const isProfileLoaded = newProps.isLoading === false &&
      !!newProps.business &&
      !!newProps.business.get('id');

    if (newProps.isLoadingProducts === false &&
      wasLoadingProfile &&
      isProfileLoaded) {
      this.props.requestBusinessProducts(newProps.business.get('id'));
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
        title: 'Products',
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  }

  props: Props
  render() {
    const {
      category,
      business,
      products,
      productPages,
      slug,
    } = this.props;

    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const businessId = business.get('id');
    const baseUrl = `/${categoryPlural}/${slug}`;
    const title = `${products.size} products`;

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
              value={'Products'}
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
        <BorderedTitle>{title}</BorderedTitle>
        <ProductsList data={products} />
        <Pagination
          initialPage={1}
          pageCount={productPages}
          onPageChange={(e) => this.props.requestBusinessProducts(businessId, ['page'], e)}
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
  products: state.getIn(['profile', 'products', 'data', 'hits']),
  productPages: state.getIn(['profile', 'products', 'data', 'pages']),
  comment: state.getIn(['profile', 'comment']),
  isLoadingProducts: state.getIn(['profile', 'products', 'isLoading']),
  businessFollowLike: state.getIn(['profile', 'businessFollowLike']),
  follows: state.getIn(['profile', 'follows']),
  likes: state.getIn(['profile', 'likes']),
});

const mapDispatchToProps = (dispatch) => ({
  requestBusinessProfile: (slug, value) => dispatch(requestBusinessProfile(slug, value)),
  requestBusinessProducts: (category, id, value) => dispatch(requestBusinessProducts(category, id, value)),
  requestComment: (payload, commentId) => dispatch(requestComment(payload, commentId)),
  followLikeBusiness: (businessId, actionType) => dispatch(followLikeBusiness(businessId, actionType)),
  requestBusinessFollows: (businessId) => dispatch(requestBusinessFollows(businessId)),
  requestBusinessLikes: (businessId) => dispatch(requestBusinessLikes(businessId)),
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessProductContainer);
