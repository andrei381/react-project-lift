// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import moment from 'moment';
import type { List, Map } from 'immutable';
import cx from 'classnames';

import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';
import ReplyForm from 'components/Advice/Answer/List/Reply/Form';
import Reply from 'components/Advice/Answer/List/Reply';
import Button from 'components/Button';
import Spinner from 'components/Spinner';


import './styles.scss';

type Props = {
  answer: Map<string, *>,
  answerIndex: number,
  submitReply: Function,
  upVoteAnswer: Function,
  downVoteAnswer: Function,
  markAnswerAsCorrect: Function,
  isReplySubmitting: boolean,
  isMarkingAnswerAsCorrect: boolean,
  isMarkable: boolean,
  correctAnswer: string,
};

class Answer extends Component {

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

  renderReplies(replies: List<Map<string, string>>) {
    return replies.map((reply) => (
      <Reply
        key={generate()}
        reply={reply}
      />
    ));
  }

  render() {
    const {
      answer,
      answerIndex,
      submitReply,
      upVoteAnswer,
      downVoteAnswer,
      isReplySubmitting,
      isMarkingAnswerAsCorrect,
      correctAnswer,
      isMarkable,
    } = this.props;
    const { showReplyForm } = this.state;
    const answerId = answer.get('_id');
    const avatar = answer.getIn(['user', 'picture']);
    const username = answer.getIn(['user', 'username']);
    const reputation = answer.getIn(['user', 'reputation']);
    let joined = answer.getIn(['user', 'joindate']);
    const userRole = answer.getIn(['user', 'role']);
    const createdOn = answer.get('createdOn');
    const message = answer.get('messageHtml');
    const upVotes = answer.get('upVotes').size;
    const downVotes = answer.get('downVotes').size;
    const replies = answer.get('replies');

    const className = cx('answer', { 'answer--correct': correctAnswer === answerId });

    if (joined) {
      joined = moment(joined).format('MMM D, YYYY');
    }
    return (
      <div className={className}>
        <div className="row nm">
          <div className="answer__user medium-4 row">
            <div className="column shrink">
              <img
                src={avatar}
                alt={username}
                className="answer__avatar"
              />
            </div>
            <div className="column">
              <div className="mb-sm">
                <Label>{userRole}</Label>
              </div>
              <div className="answer__name mb-mn">{username}</div>
              <div className="answer__reputation ">{`Reputation ${String(reputation)}`}</div>
              <div className="answer__joined mb-mn">{`Joined ${String(joined)}`}</div>
              <TimeAgo
                className="answer__time"
                data={createdOn}
              />
            </div>
          </div>
          <div className="answer__message column medium-8">
            <div
              className="answer__text row"
              dangerouslySetInnerHTML={{ __html: message }}
            />
            <div className="mb-lg">
              <div className="answer__inquiry row">Was this answer helpful?</div>
              <div className="row">
                <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                  className="answer__vote column shrink npl"
                  onClick={() => upVoteAnswer(answerIndex, answerId)}
                >
                  Yes
                  <Label
                    className="answer__voteLabel success ml-mn"
                    hasArrow
                  >
                    {upVotes}
                  </Label>
                </div>
                <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                  className="answer__vote column shrink"
                  onClick={() => downVoteAnswer(answerIndex, answerId)}
                >
                  No
                  <Label
                    className="answer__voteLabel danger ml-mn"
                    hasArrow
                  >
                    {downVotes}
                  </Label>
                </div>

                <div className="column text-right">
                  <a // eslint-disable-line jsx-a11y/no-static-element-interactions
                    onClick={() => {
                      this.setState({
                        showReplyForm: !this.state.showReplyForm,
                      });
                    }}
                  >
                    Reply
                  </a>
                </div>
              </div>
            </div>
            {
              showReplyForm &&
                <ReplyForm
                  className="nm"
                  answerId={answerId}
                  isSubmiting={isReplySubmitting}
                  error={''}
                  onSubmit={submitReply}
                />
            }
            {
              isMarkable && <div className="row mb-lg">
                <Button
                  className="answer__correctButton column button light"
                  type="button"
                  onClick={() => {
                    this.props.markAnswerAsCorrect(answerId);
                  }}
                >{isMarkingAnswerAsCorrect && <Spinner className="mr-sm" />}Mark This Question As Correct</Button>
              </div>
            }
          </div>
        </div>
        <div className="answer__replies">
          {
            this.renderReplies(replies)
          }
        </div>
      </div>
    );
  }
}


export default Answer;
