// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { List, Map } from 'immutable';

import BorderedTitle from 'components/BorderedTitle';
import Answer from 'containers/Advice/Answer';


type Props = {
  answers: List<Map<string, string>>,
  correctAnswer: string,
  isMarkable: boolean,
};

class AnswerList extends Component {
  props: Props

  renderAnswers(answers: List<Map<string, string>>, correctAnswer: string) {
    const { isMarkable } = this.props;
    return answers.map((answer, index) => (
      <Answer
        key={generate()}
        answer={answer}
        answerIndex={index}
        correctAnswer={correctAnswer}
        isMarkable={isMarkable}
      />
    ));
  }

  render() {
    const { answers, correctAnswer } = this.props;
    return (
      <div className="answerList mb-xl">
        <div className="row column">
          <BorderedTitle
            element="h2"
            className="borderedTitle"
            leftAligned
          >
            {`${answers.size} answers`}
          </BorderedTitle>
        </div>
        <div className="row column">
          {
            this.renderAnswers(answers, correctAnswer)
          }
        </div>
      </div>
    );
  }
}

export default AnswerList;
