// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import { browserHistory } from 'react-router';

import Helmet from 'components/Helmet';
import BusinessInfo from 'components/BusinessInfo';
import Spinner from 'components/Spinner';
import Breadcrumbs from 'components/Breadcrumbs';

type Props = {
  category: string,
  isLoading: boolean,
  error: string,
  business: Object,
  comment: Object,
  slug: string,
  businessFollowLike: Object,
  requestComment: Function,
  followLikeBusiness: Function,
  currentUser: Object,
  follows: Object,
  likes: Object,
  breadcrumbPath: List<Map<string, Object>>,
  requestBusinessProfile: Function,
  requestBusinessFollows: Function,
  requestBusinessLikes: Function,
  setMetaJson: Function,
};

class BusinessProfileContainer extends Component {
  componentWillMount() {
    const { slug } = this.props;
    this.props.requestBusinessProfile(slug);
  }

  componentWillReceiveProps(newProps: Props) {
    const { business, comment, category, slug } = newProps;

    const wasUpdatingComment = this.props.comment.get('isLoading');
    const isCommentUpdated = comment.get('isLoading') === false &&
      comment.get('error') === '';

    const wasLoadingBusiness = this.props.isLoading;
    const isBusinessLoaded = newProps.isLoading === false && newProps.error === '';

    const wasFollowingOrLiking = this.props.businessFollowLike.get('isLoading');
    const isFollowedOrLiked = newProps.businessFollowLike.get('isLoading') === false && newProps.businessFollowLike.get('error') === '';

    let businessMetaJson = {};

    if ((wasLoadingBusiness && isBusinessLoaded) || (wasFollowingOrLiking && isFollowedOrLiked)) {
      this.props.requestBusinessFollows(newProps.business.get('_id'));
      this.props.requestBusinessLikes(newProps.business.get('_id'));
    }

    if (business &&
      wasUpdatingComment === true &&
      isCommentUpdated === true) {
      const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);

      browserHistory.push(`/${categoryPlural}/${slug}/comments`);
    }

    if ((business.size > 0)) {
      businessMetaJson = {
        '@type': 'Organization',
        name: business.get('name'),
        email: business.get('email'),
        faxNumber: business.get('fax'),
        logo: business.get('thumbnail'),
        description: business.get('description'),
        telephone: business.get('telephone'),
        url: business.get('website'),
        address: {
          '@type': 'PostalAddress',
          addressLocality: business.getIn(['locations', 0, 'city']),
          addressRegion: business.getIn(['locations', 0, 'province']),
          postalCode: business.getIn(['locations', 0, 'postalCode']),
          streetAddress: business.getIn(['locations', 0, 'address']),
        },
      };
      if (business.get('reviews') && business.get('reviews').size > 0) {
        businessMetaJson.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: business.get('rating') ? business.get('rating') : 5,
          bestRating: 5,
          worstRating: 0,
          reviewCount: business.get('reviews').size,
        };
      }
      this.props.setMetaJson(['mainEntity'], businessMetaJson);
    }
  }
  props: Props
  render() {
    const {
      category,
      business,
      comment,
      isLoading,
      error,
      slug,
      currentUser,
      businessFollowLike,
      follows,
      likes,
      breadcrumbPath,
    } = this.props;

    if (isLoading) return <div className="text-center"><Spinner height={548} /></div>;
    return (
      business && error === '' ? <div>
        <Helmet title={business.get('name')} />
        <Breadcrumbs
          path={breadcrumbPath}
        />
        <BusinessInfo
          category={category}
          data={business}
          slug={slug}
          comment={comment}
          businessFollowLike={businessFollowLike}
          requestComment={this.props.requestComment}
          followLikeBusiness={this.props.followLikeBusiness}
          currentUser={currentUser}
          follows={follows}
          likes={likes}
        />
      </div> : null
    );
  }
}

export default BusinessProfileContainer;
