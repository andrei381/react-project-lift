// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import CommentResponse from 'components/CommentList/CommentResponse';
import CommentModal from 'components/CommentModal';
import TimeAgo from 'components/TimeAgo';
import './styles.scss';

type Props = {
  data: Object,
  currentUserId?: number,
  requestComment: Function,
  deleteComment: Function,
  comment: Object,
};

class CommentItem extends Component {
  deleteComment = () => {
    const { data } = this.props;
    const commentId = data.get('_id');
    if (confirm("Are you sure you'd like to remove this comment?")) {
      this.props.deleteComment(commentId);
    }
  }
  props: Props
  render() {
    const {
      data,
      currentUserId,
      requestComment,
      deleteComment,
      comment,
    } = this.props;

    const message = data.get('message');
    const userAvatar = data.getIn(['user', 'picture']);
    const userName = data.getIn(['user', 'username']);
    const userId = data.getIn(['user', '_id']);
    const userSlug = data.getIn(['user', 'slug']);
    const guestName = data.getIn(['guest', 'name']);
    const commentDate = data.get('updatedOn');
    const replies = data.get('replies');
    const topic = data.get('topic');
    const url = data.get('url');
    const id = data.get('_id');
    const isLoadingComment = comment.get('isLoading');
    const commentError = comment.get('error');
    return (
      <div className="row mb-lg">
        <div className="columns commentItem">
          <div className="row">
            <div className="shrink column">
              {userAvatar ?
                <div
                  className="commentItem__image"
                  style={{ backgroundImage: `url('${userAvatar}')` }}
                />
                :
                <div className="commentItem__image commentItem__image--default" />
              }
            </div>
            <div className="column small-3">
              <div>
                {userId ?
                  <Link
                    to={`/members/${userSlug}`}
                    className="t-lowercase fs-xl"
                  >{userName}</Link>
                  :
                  <div className="t-lowercase fs-xl">{guestName}</div>
                }
              </div>
              <TimeAgo data={commentDate} />
            </div>
            <div className="column">
              <div className="row mb-lg">
                <div className="column fs-md">
                  {message}
                </div>
              </div>
              <div className="row mb-md align-middle">
                <div className="column text-right">

                  {userId === currentUserId &&
                    <Link
                      className="mr-md fs-md"
                      onClick={this.deleteComment}
                    >Remove</Link>
                  }
                  {!!currentUserId &&
                    <CommentModal
                      topic={topic}
                      url={url}
                      commentId={id}
                      requestComment={requestComment}
                      isLoading={isLoadingComment}
                      error={commentError}
                      linkText={'Reply'}
                      textIsButton
                      linkStyle="button secondary mr-md"
                    />
                  }
                </div>
              </div>
              {replies && replies.entrySeq().map(([key, value]) => (
                <CommentResponse
                  key={key}
                  data={value}
                  currentUserId={currentUserId}
                  deleteComment={deleteComment}
                  comment={comment}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentItem;
