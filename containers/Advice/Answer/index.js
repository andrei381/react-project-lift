// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import Answer from 'components/Advice/Answer/List/Answer';

import { submitReply, upVoteAnswer, downVoteAnswer, markAnswerAsCorrect } from 'pages/Advice/Question/sagas';

type Props = {
  answer: Map<string, string>,
  answerIndex: number,
  submitReply: Function,
  upVoteAnswer: Function,
  downVoteAnswer: Function,
  markAnswerAsCorrect: Function,
  isReplySubmitting: boolean,
  isMarkingAnswerAsCorrect: boolean,
  correctAnswer: string,
  isMarkable: boolean,
};

class AnswerContainer extends Component {
  state: {
    showReplyForm: boolean,
  }
  props: Props
  render() {
    const { answer, answerIndex, isReplySubmitting, isMarkingAnswerAsCorrect, correctAnswer, isMarkable } = this.props;
    return (
      <Answer
        answer={answer}
        answerIndex={answerIndex}
        submitReply={this.props.submitReply}
        upVoteAnswer={this.props.upVoteAnswer}
        downVoteAnswer={this.props.downVoteAnswer}
        markAnswerAsCorrect={this.props.markAnswerAsCorrect}
        isReplySubmitting={isReplySubmitting}
        isMarkingAnswerAsCorrect={isMarkingAnswerAsCorrect}
        correctAnswer={correctAnswer}
        isMarkable={isMarkable}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  isReplySubmitting: state.getIn(['adviceQuestion', 'replyForm', 'isLoading']),
  isMarkingAnswerAsCorrect: state.getIn(['adviceQuestion', 'question', 'isUpdating']),
});

const mapDispatchToProps = (dispatch) => ({
  submitReply: (payload, answerId) => dispatch(submitReply(payload, answerId)),
  upVoteAnswer: (answerIndex, answerId) => dispatch(upVoteAnswer(answerIndex, answerId)),
  downVoteAnswer: (answerIndex, answerId) => dispatch(downVoteAnswer(answerIndex, answerId)),
  markAnswerAsCorrect: (answerIndex, answerId) => dispatch(markAnswerAsCorrect(answerIndex, answerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnswerContainer);
