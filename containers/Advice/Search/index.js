// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import AdviceSearch from 'components/Advice/Search';

import { requestQuestions } from 'pages/Advice/sagas';

type Props = {
  categories: List<*>,
  questions: Object,
  isLoading: boolean,
  pages: number,
  requestQuestions: Function,
  push: Function,
  slug: string,
}

class AdviceSearchContainer extends Component {
  props: Props
  render() {
    const { isLoading, questions, categories, pages, slug } = this.props;
    return (
      <AdviceSearch
        isLoading={isLoading}
        questions={questions}
        categories={categories}
        pages={pages}
        requestQuestions={this.props.requestQuestions}
        push={this.props.push}
        slug={slug}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['advice', 'questions', 'isLoading']),
  questions: state.getIn(['advice', 'questions', 'data', 'hits']),
  pages: parseInt(state.getIn(['advice', 'questions', 'data', 'pages']), 10),
});

const mapDispatchToProps = (dispatch) => ({
  requestQuestions: (filter) => dispatch(requestQuestions(filter)),
  push: (path) => dispatch(push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdviceSearchContainer);

