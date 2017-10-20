// @flow

import React, { Component } from 'react';
import CommentItem from 'components/CommentList/CommentItem';
import Preloader from 'components/Preloader';
import type { Map } from 'immutable';

type Props = {
  isLoading: boolean,
  currentUser: Object,
  data: Map<string, Object>,
  requestComment: Function,
  deleteComment: Function,
  comment: Object,
};

class CommentList extends Component {
  props: Props
  render() {
    const {
      data,
      isLoading,
      currentUser,
      comment,
      requestComment,
      deleteComment,
    } = this.props;

    const currentUserId = currentUser ? currentUser.get('_id') : 0;

    return (
      <div className="commentList">
        {isLoading ?
          <div className="text-center">
            <Preloader height={548} />
          </div>
          :
          (data && data.entrySeq().map(([key, value]) => (
            <CommentItem
              key={key}
              data={value}
              currentUserId={currentUserId}
              requestComment={requestComment}
              deleteComment={deleteComment}
              comment={comment}
            />
          )))
        }
      </div>
    );
  }
}

export default CommentList;
