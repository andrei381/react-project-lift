// @flow

import React, { Component } from 'react';
import TimeAgo from 'components/TimeAgo';

import './styles.scss';

type Props = {
  reply: Object,
};

class Reply extends Component {

  constructor(props: Object) {
    super(props);
    this.state = {
      showReplyForm: false,
    };
  }

  state: {
    showReplyForm: boolean,
  };

  props: Props

  render() {
    const { reply } = this.props;
    const avatar = reply.getIn(['user', 'picture']);
    const username = reply.getIn(['user', 'username']);
    const reputation = reply.getIn(['user', 'reputation']);
    const joined = reply.getIn(['user', 'joindate']);
    const createdOn = reply.get('createdOn');
    const message = reply.get('messageHtml');

    return (
      <div className="reply">
        <div className="reply__border row nm">
          <div className="reply__user medium-4 row">
            <div className="column shrink">
              <img
                className="reply__avatar"
                src={avatar}
                alt={username}
              />
            </div>
            <div className="column">
              <div className="reply__userName mb-mn">{username}</div>
              <div className="reply__userReputation ">Reputation {reputation}</div>
              <div className="reply__userJoined mb-mn">Joined {joined}</div>
              <TimeAgo
                className="reply__userTime"
                data={createdOn}
              />
            </div>
          </div>
          <div className="reply__message column medium-8">
            <div
              className="row"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Reply;
