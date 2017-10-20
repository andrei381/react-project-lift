// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import type { Map } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';
import AnswerList from 'components/Advice/Answer/List';
import QuestionInfo from 'components/Advice/Question/Info';
import AnswerForm from 'components/Advice/Answer/Form';
import Spinner from 'components/Spinner';

import BannerBG from './banner.jpg';
import { requestQuestion, submitAnswer, requestCategories } from './sagas';

type Props = {
  params: Object,
  requestQuestion: Function,
  requestCategories: Function,
  categories: List<*>,
  isLoading: boolean,
  isSubmiting: boolean,
  error: '',
  question: Map<string, *>,
  submitAnswer: Function,
  currentUser: Object,
};

class QuestionPage extends Component {
  componentDidMount() {
    const { params: { questionSlug } } = this.props;
    this.props.requestCategories();
    this.props.requestQuestion(questionSlug);
  }

  props: Props

  render() {
    const {
      isLoading,
      params: {
        categorySlug,
        questionSlug,
      },
      categories,
      question,
      isSubmiting,
      error,
      currentUser,
    } = this.props;
    const category = categories ? categories.find((cat) => (cat.get('slug') === categorySlug)) : null;
    const bannerTitle = category ? category.get('name') : 'Questions & Answers on Medical Marijuana';
    const bannerDescription = category ? category.get('description') : 'Advice on health, laws and regulations, strains, producers, doctors and more. Ask a question and help other members.';
    const bennerUrl = category && category.get('bannerPhoto') ? category.get('bannerPhoto') : BannerBG;
    const isMarkable = question.getIn(['user', 'id']) === currentUser.get('id') &&
      question.get('closed') === false;
    return (
      <div>
        <Helmet title="Advice" />
        <Breadcrumbs
          path={fromJS([
            {
              link: '/advice',
              title: 'Advice',
            },
            {
              link: `/advice/${categorySlug}`,
              title: `${categorySlug}`,
            },
            {
              link: `/advice/${categorySlug}/${questionSlug}`,
              title: `${questionSlug}`,
            },
          ])}
        />
        <Banner
          title={bannerTitle}
          subtitle={bannerDescription}
          bg={bennerUrl}
          height={246}
        />
        {isLoading ?
          <div className="text-center">
            <Spinner height={548} />
          </div> :
          <div>
            <QuestionInfo
              className="row column"
              question={question}
              category={question.get('category')}
              showDetail
            />
            <div className="row mb-sm">
              <div className="column">
                <h2>Answer this question</h2>
              </div>
            </div>
            <AnswerForm
              questionId={question.get('_id')}
              isSubmiting={isSubmiting}
              error={error}
              onSubmit={this.props.submitAnswer}
            />
            <AnswerList
              correctAnswer={question.get('correctAnswer')}
              answers={question.get('answers')}
              isMarkable={isMarkable}
            />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['adviceQuestion', 'question', 'isLoading']),
  question: state.getIn(['adviceQuestion', 'question', 'data']),
  isSubmiting: state.getIn(['adviceQuestion', 'answerForm', 'isLoading']),
  error: state.getIn(['adviceQuestion', 'answerForm', 'error']),
  categories: state.getIn(['adviceQuestion', 'categories', 'data', 'hits']),
  currentUser: state.getIn(['app', 'user']),
});

const mapDispatchToProps = (dispatch) => ({
  requestQuestion: (slug) => dispatch(requestQuestion(slug)),
  submitAnswer: (data) => dispatch(submitAnswer(data)),
  requestCategories: () => dispatch(requestCategories()),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionPage);
