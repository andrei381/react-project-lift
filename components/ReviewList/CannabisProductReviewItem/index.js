// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import RequireAuth from 'components/RequireAuth';
import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';
import StarRating from 'components/StarRating';
import ItemDetail from './ItemDetail';
import EllipsisMessage from './EllipsisMessage';

import './styles.scss';

type Props = {
  category: string,
  data: Object,
  slug: string,
  voteReview: Function,
  currentUserId?: number,
  deleteReview: Function,
};

class CannabisProductReviewItem extends Component {
  voteReview = (type: string) => {
    const { data } = this.props;
    const reviewId = data.get('_id');
    this.props.voteReview(reviewId, type);
  }
  deleteReview = () => {
    const { data } = this.props;
    const reviewId = data.get('_id');
    if (confirm("Are you sure you'd like to remove this review?")) {
      this.props.deleteReview(reviewId);
    }
  }
  handleChange = () => {
  }
  props: Props
  render() {
    const {
      data,
      currentUserId,
      slug,
      category,
    } = this.props;

    const categoryPlural = `${category}s`;

    let message = data.get('message');
    if (!message) {
      message = 'This user had nothing else to say.';
    }
    const reviewId = data.get('_id');
    const userAvatar = data.getIn(['user', 'picture']);
    const userName = data.getIn(['user', 'username']);
    const userId = data.getIn(['user', '_id']);
    const userSlug = data.getIn(['user', 'slug']);
    const userReputation = data.getIn(['user', 'reputation']);
    let userJoinDate = data.getIn(['user', 'createdOn']);
    if (userJoinDate) {
      userJoinDate = moment(userJoinDate).format('MM/YY');
    }
    const title = data.get('title') ? data.get('title') : 'No topic';
    const guestName = data.getIn(['guest', 'name']);
    const rating = data.get('rating');
    const reviewDate = data.get('createdOn');
    const upVotesCount = data.get('upVotes') ? data.get('upVotes').size : 0;
    const downVotesCount = data.get('downVotes') ? data.get('downVotes').size : 0;

    let purchasedDate = data.get('purchasedOn');
    const thc = data.get('thc');
    let cbd = data.get('cbd');

    if (purchasedDate) {
      purchasedDate = moment(purchasedDate).format('MM/DD/YYYY');
    }

    if (cbd) {
      cbd = moment(cbd).format('0.00%');
    }
    return (
      <div className="cannabisProductReviewItem">
        <div className="row mb-lg">
          <div className="shrink column small-12">
            {userAvatar ?
              <div
                className="cannabisProductReviewItem__image"
                style={{ backgroundImage: `url('${userAvatar}')` }}
              />
              :
              <div className="cannabisProductReviewItem__image cannabisProductReviewItem__image--default" />
            }
          </div>
          <div className="column small-12 medium-3">
            <div className="mb-mn">
              {userId ?
                <Link
                  to={`/members/${userSlug}`}
                  className="t-lowercase fs-xl"
                >{userName}</Link>
                :
                <div className="t-lowercase fs-xl">{guestName}</div>
              }
            </div>
            {userId && <div className="t-uppercase fs-sm">
              Reputation <strong>{userReputation}</strong>
            </div>}
            {userId && <div className="t-uppercase fs-sm">
              Joined <strong>{userJoinDate}</strong>
            </div>}
            {userId && <Link to={`/users/${userId}/reviews`}>
              View Reviews
            </Link>}
          </div>
          <div className="column">
            <div className="row align-middle mb-md">
              <div className="column shrink">
                <StarRating initialRate={rating} />
              </div>
              <div className="column shrink">
                <TimeAgo data={reviewDate} />
              </div>
              { userId === currentUserId &&
                <Link
                  className="fs-md mr-md"
                  onClick={this.deleteReview}
                >Remove</Link>
              }
              { userId === currentUserId &&
                <Link
                  className="fs-md"
                  to={`/${categoryPlural}/${slug}/reviews/${reviewId}/edit`}
                >Edit</Link>
              }
            </div>
            <div className="row mb-md">
              <div className="column small-12 medium-8">
                <div className="mb-md">
                  <Link
                    className="fs-mx t-capitalize mb-md"
                    to={`/${categoryPlural}/${slug}/reviews/${reviewId}`}
                  >{title}</Link>
                </div>
                <div className="fs-base">
                  <EllipsisMessage message={message} />
                </div>
              </div>
              <div className="column small-12 medium-4">
                <div className="mb-md fs-base">
                  Batch Information
                </div>
                {purchasedDate &&
                  <div className="fs-base mb-sm">
                    <div className="cannabisProductReviewItem__batchLabel">
                      Date Purchased
                    </div>
                    <div className="cannabisProductReviewItem__batchValue">
                      {purchasedDate}
                    </div>
                  </div>
                }

                {thc &&
                  <div className="fs-base mb-sm">
                    <div className="cannabisProductReviewItem__batchLabel">
                      THC%
                    </div>
                    <div className="cannabisProductReviewItem__batchValue">
                      {thc}%
                    </div>
                  </div>
                }

                {cbd &&
                  <div className="fs-base mb-sm">
                    <div className="cannabisProductReviewItem__batchLabel">
                      CBD%
                    </div>
                    <div className="cannabisProductReviewItem__batchValue">
                      {cbd}
                    </div>
                  </div>
                }
                <div className="mb-mn fs-base">
                  Would purchase again?
                </div>
                <div className="fs-mn">
                  <strong>
                    {
                      data.get('wouldPurchaseAgain') ? 'Yes' : 'No'
                    }
                  </strong>
                </div>
              </div>
            </div>

            <ItemDetail
              data={data}
            />
            <div className="row align-bottom">
              <div className="column">
                <div className="row mb-sm">
                  <div className="column fs-md t-uppercase">
                    <strong>Was this review helpful?</strong>
                  </div>
                </div>
                {
                  currentUserId ? <div className="row mb-md">
                    <div className="column shrink">
                      <Link
                        className="cannabisProductReviewItem__voteLink"
                        onClick={() => { this.voteReview('up'); }}
                      >Yes</Link>
                      <Label
                        className="success fs-md"
                        hasArrow
                      >
                        {upVotesCount}
                      </Label>
                    </div>
                    <div className="column shrink">
                      <Link
                        className="cannabisProductReviewItem__voteLink"
                        onClick={() => { this.voteReview('down'); }}
                      >No</Link>
                      <Label
                        className="danger fs-md"
                        hasArrow
                      >
                        {downVotesCount}
                      </Label>
                    </div>
                  </div> : <div className="row mb-md">
                    <div className="column shrink">
                      <RequireAuth toDo="vote reviews">
                        <Link
                          className="cannabisProductReviewItem__voteLink"
                        >Yes</Link>
                        <Label
                          className="success fs-md"
                          hasArrow
                        >
                          {upVotesCount}
                        </Label>
                      </RequireAuth>
                    </div>
                    <div className="column shrink">
                      <RequireAuth toDo="vote reviews">
                        <Link
                          className="cannabisProductReviewItem__voteLink"
                        >No</Link>
                        <Label
                          className="danger fs-md"
                          hasArrow
                        >
                          {downVotesCount}
                        </Label>
                      </RequireAuth>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CannabisProductReviewItem;
