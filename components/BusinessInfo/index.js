// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import SocialLink from 'components/SocialLink';
import ReviewCount from 'components/ReviewCount';
import Button from 'components/Button';
import CommentModal from 'components/CommentModal';
import Label from 'components/Label';
import RequireAuth from 'components/RequireAuth';
import ProductAction from 'components/ProductAction';

import FacebookIcon from 'images/sprite/facebook-square.svg';
import TwitterIcon from 'images/sprite/twitter-square.svg';
import LinkedinIcon from 'images/sprite/linkedin-square.svg';
import PinterestIcon from 'images/sprite/pinterest-square.svg';
import GoogleIcon from 'images/sprite/google-plus-square.svg';
import FoursquareIcon from 'images/sprite/foursquare.svg';
import YoutubeIcon from 'images/sprite/youtube-square.svg';
import InstagramIcon from 'images/sprite/instagram.svg';
import IconPlus from 'images/sprite/plus.svg';
import IconHeart from 'images/sprite/heart.svg';
import './styles.scss';

type Props = {
  category: string,
  data: Object,
  slug: string,
  requestComment: Function,
  comment: Object,
  currentUser: Object,
  followLikeBusiness: Function,
  follows: Object,
  likes: Object,
};

class BusinessInfo extends Component {
  props: Props
  followLikeBusiness = (actionType: string) => {
    this.props.followLikeBusiness(this.props.data.get('_id'), actionType);
  }
  render() {
    const { category, data, slug, comment, requestComment, currentUser, follows, likes } = this.props;

    const isLoadingComment = comment.get('isLoading');
    const commentError = comment.get('error');

    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);

    const email = data.get('email');
    const telephone = data.get('telephone');
    const address = data.getIn(['locations', 0, 'address']);
    const city = data.getIn(['locations', 0, 'city']);
    const province = data.getIn(['locations', 0, 'province']);
    const postalCode = data.getIn(['locations', 0, 'postalCode']);
    const name = data.get('name');
    const website = data.get('website');
    const thumbnail = data.get('thumbnail');
    const reviewCount = data.get('reviews') ? data.get('reviews').size : 0;
    const rating = data.get('rating');

    const linkedinLink = data.get('linkedin');
    const facebookLink = data.get('facebook');
    const twitterLink = data.get('twitter');
    const pinterestLink = data.get('pinterest');
    const googleLink = data.get('google');
    const foursquareLink = data.get('foursquare');
    const youtubeLink = data.get('youtube');
    const instagramLink = data.get('instagram');

    const topic = {
      name: data.get('name'),
      ref: data.get('id'),
    };
    const url = window.location.href;
    return (
      <div className="businessInfo mb-xl">
        <div className="row">
          <div className="columns">
            <Label className="purple">
              {category}
            </Label>
          </div>
        </div>
        <div className="businessInfo__infoSection mt-md row">
          <div className="shrink column hide-for-small-only">
            <div
              className="businessInfo__image"
              style={{ backgroundImage: `url('https://images.lift.co/resize/170x170/${thumbnail}')` }}
            />
          </div>
          <div className="column small-12 medium-expand">
            <h1 className="c-secondary t-capitalize">{name}</h1>

            <div className="row align-middle mb-sm">
              <div className="columns small-12 medium-shrink mb-sm">
                <ReviewCount
                  className="businessInfo__rating"
                  reviewCount={reviewCount}
                  ratingsAverage={rating}
                  to={`/${categoryPlural}/${slug}/reviews`}
                />
              </div>
              <div className="columns hide-for-small-only" />
              <div className="shrink column mb-sm">
                <Link
                  className="businessInfo__actionLink"
                  to={`/${categoryPlural}/${slug}/create-review`}
                >
                  <Button
                    element="button"
                    className="secondary"
                  >REVIEW</Button>
                </Link>
              </div>
              { currentUser ?
                <div className="shrink column mb-sm">
                  <CommentModal
                    topic={topic}
                    url={url}
                    requestComment={requestComment}
                    isLoading={isLoadingComment}
                    error={commentError}
                    linkText={'Comment'}
                    textIsButton
                  />
                </div> : <div className="shrink column mb-sm">
                  <RequireAuth toDo="add comments">
                    <Button>Comment</Button>
                  </RequireAuth>
                </div>
              }
            </div>
            <div className="row align-middle mb-md">
              <div className="column">
              </div>
              <div className="shrink column right">
                {
                  currentUser ?
                    <ProductAction
                      glyph={IconPlus}
                      title="Follow"
                      count={follows.get('count')}
                      onClick={() => this.followLikeBusiness('follow')}
                    /> : <RequireAuth toDo="follow business">
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
                      onClick={() => this.followLikeBusiness('like')}
                    /> : <RequireAuth toDo="like business">
                      <ProductAction
                        glyph={IconHeart}
                        title="Like"
                        count={likes.get('count')}
                      />
                    </RequireAuth>
                }
              </div>
            </div>
            <div className="row align-bottom mb-md">
              <div className="columns small-12 medium-shrink">
                {address}, {city}, {province}{postalCode && `, ${postalCode}`}
              </div>
              <div className="columns c-primary fs-tn" />
              {telephone &&
                <div className="columns small-12 medium-shrink">
                  <Link
                    className="t-lowercase"
                    to={`tel:${telephone}`}
                  >{telephone}</Link>
                </div>
              }
              {email &&
                <div className="columns small-12 medium-shrink">
                  <Link
                    className="t-lowercase"
                    to={`mailto:${email}`}
                  >{email}</Link>
                </div>
              }
              {website &&
                <div className="columns small-12 medium-shrink">
                  <a
                    className="t-lowercase"
                    href={website}
                    target="_blank"
                  >{website}</a>
                </div>
              }
            </div>
            <div className="row mb-lg">
              <div className="shrink column">
                <SocialLink
                  link={facebookLink}
                  icon={FacebookIcon}
                  className="mr-md"
                />
                <SocialLink
                  link={twitterLink}
                  icon={TwitterIcon}
                  className="mr-md"
                />
                <SocialLink
                  link={linkedinLink}
                  icon={LinkedinIcon}
                  className="mr-md"
                />
                <SocialLink
                  link={pinterestLink}
                  icon={PinterestIcon}
                  className="mr-md"
                />
                <SocialLink
                  link={googleLink}
                  icon={GoogleIcon}
                  className="mr-md"
                />
                <SocialLink
                  link={foursquareLink}
                  icon={FoursquareIcon}
                  className="mr-md"
                />
                <SocialLink
                  link={youtubeLink}
                  icon={YoutubeIcon}
                  className="mr-md"
                />
                <SocialLink
                  link={instagramLink}
                  icon={InstagramIcon}
                  className="mr-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessInfo;
