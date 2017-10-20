// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import TagList from 'components/TagList';
import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';
import './styles.scss';

type Props = {
  question: Object,
  category: Object,
  showDetail: boolean,
};

class QuestionInfo extends Component {
  getLastAnsweredDate = (answers, createdOn) => {
    let lastDate = createdOn;
    answers.forEach((v) => {
      const a = new Date(lastDate).getTime();
      const b = new Date(v.get('createdOn')).getTime();
      if (a < b) {
        lastDate = v.get('createdOn');
      }
      return true;
    });

    return lastDate;
  }
  props: Props
  renderDetails = (message, tags) => (
    <div>
      { message &&
        <div className="row mt-md">
          <div
            className="questionInfo__message column medium-9 small-12"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      }
      <div className="questionInfo__tags row mt-md column">
        <TagList
          values={tags}
          readOnly
        />
      </div>
    </div>
  )

  render() {
    const { question, category, showDetail } = this.props;
    const avatar = question.getIn(['user', 'picture']);
    const username = question.getIn(['user', 'username']);
    const closed = question.get('closed');
    const createdOn = question.get('createdOn');
    const title = question.get('titleHtml');
    const message = question.get('messageHtml');
    const views = question.get('views');
    const answers = question.get('answers');
    const answerCount = answers.size;
    const lastDate = this.getLastAnsweredDate(answers, createdOn);
    const tags = question.get('tags');

    return (
      <div className="questionInfo mb-xl">
        <div className="row">
          <div className="shrink columns mr-lg">
            <Label
              className={classnames({ danger: closed,
                success: !closed })}
            >
              {closed ? 'Closed' : 'Open'}
            </Label>
          </div>
          <div className="shrink column">
            <Link
              className="questionInfo__actionLink t-uppercase fs-mn"
              to={`/advice/${category.get('slug')}`}
            >{category.get('name')}</Link>
          </div>
        </div>

        <div className="row mt-md">
          <div className="questionInfo__title column">
            <Link
              className="questionInfo__slugLink"
              to={`/advice/${category.get('slug')}/${question.get('slug')}`}
            >{title}</Link>
          </div>
          <div className="shrink column">
            <div className="row">
              <div className="shrink column fs-mn"><div className="fs-lg text-center">{ answerCount || 0 }</div>Answers</div>
              <div className="shrink column fs-mn"><div className="fs-lg text-center">{ views }</div>Views</div>
            </div>
          </div>
        </div>
        {
          showDetail && this.renderDetails(message, tags)
        }
        <div className="row align-middle mt-md">
          <div className="shrink column npr">
            <img
              className="questionInfo__avatar"
              src={avatar}
              alt={username}
            />
          </div>
          <div className="shrink column">
            <div className="questionInfo__user">{username}</div>
          </div>
          <div className="shrink column">
            <TimeAgo
              data={lastDate}
              prefix={answerCount > 0 ? 'answered' : 'asked'}
            />
          </div>
        </div>
        <div className="row mt-md">
          <div className="column">
            <div className="questionInfo__separator" />
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionInfo;
