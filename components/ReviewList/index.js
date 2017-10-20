// @flow

import React, { Component } from 'react';
import ReviewItem from 'components/ReviewList/ReviewItem';
import CannabisProductReviewItem from 'components/ReviewList/CannabisProductReviewItem';
import Preloader from 'components/Preloader';
import { List } from 'immutable';

type Props = {
  data: List<Map<string, Object>>,
  category: string,
  slug: string,
  isLoading: boolean,
  voteReview: Function,
  deleteReview: Function,
  currentUser: Object,
};

class ReviewList extends Component {
  props: Props
  render() {
    const {
      data,
      slug,
      category,
      isLoading,
      voteReview,
      deleteReview,
      currentUser,
    } = this.props;

    const currentUserId = currentUser ? currentUser.get('_id') : 0;
    return (
      <div>
        {isLoading ?
          <div className="text-center">
            <Preloader height={548} />
          </div>
          :
          (data && data.entrySeq().map(([key, value]) => {
            const type = value.get('__t');
            if (type === 'CannabisProductReview') {
              return (
                <CannabisProductReviewItem
                  category={category}
                  slug={slug}
                  key={key}
                  data={value}
                  currentUserId={currentUserId}
                  voteReview={voteReview}
                  deleteReview={deleteReview}
                />
              );
            }
            return (
              <ReviewItem
                category={category}
                slug={slug}
                key={key}
                data={value}
                currentUserId={currentUserId}
                voteReview={voteReview}
                deleteReview={deleteReview}
              />
            );
          }
          ))
        }
      </div>
    );
  }
}

export default ReviewList;
