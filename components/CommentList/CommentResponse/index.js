// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import TimeAgo from 'components/TimeAgo';
import './styles.scss';

type Props = {
  data: Object,
  currentUserId: number,
  deleteComment: Function,
};

class CommentResponse extends Component {
  deleteComment = () => {
    const { data } = this.props;
    const commentId = data.get('_id');
    if (confirm('Are you sure you\'d like to remove this comment?')) {
      this.props.deleteComment(commentId);
    }
  }
  props: Props
  render() {
    const { data, currentUserId } = this.props;
    const message = data.get('message');
    const userAvatar = data.getIn(['user', 'picture']);
    const userName = data.getIn(['user', 'username']);
    const userId = data.getIn(['user', '_id']);
    const userSlug = data.getIn(['user', 'slug']);
    const guestName = data.getIn(['guest', 'name']);
    const commentDate = data.get('updatedOn');

    return (
      <div className="commentResponse row">
        <div className="shrink column">
          {userAvatar ?
            <div
              className="commentResponse__image"
              style={{ backgroundImage: `url('${userAvatar}')` }}
            />
            :
            <div className="commentResponse__image commentResponse__image--default" />
          }
        </div>
        <div className="column">
          <div className="row mb-mn">
            <div className="column">
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
          </div>
          <div className="row">
            <div className="column small-12 fs-md mb-lg">
              {message}
            </div>
            { userId === currentUserId &&
              <div className="column small-12 text-right">
                <Link
                  className="fs-md mr-md"
                  onClick={this.deleteComment}
                >Remove</Link>
              </div>
            }
          </div>

        </div>
      </div>
    );
  }
}

export default CommentResponse;
