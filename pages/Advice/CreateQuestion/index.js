// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { List, fromJS } from 'immutable';

import HelpfulLinks from 'components/HelpfulLinks';
import QuestionForm from 'components/Advice/Question/Form';
import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';
import Spinner from 'components/Spinner';

import BannerBG from '../banner.jpg';
import './styles.scss';

import { requestCategories, requestCreateQuestion } from './sagas';

type Props = {
  requestCategories: Function,
  requestCreateQuestion: Function,
  categories: List<*>,
  isLoading: boolean,
  isSubmiting: boolean,
  error: string,
  location: Object,
};

class CreateQuestionPage extends Component {
  componentDidMount() {
    this.props.requestCategories();
  }

  props: Props

  render() {
    const { categories, isLoading, isSubmiting, location: { query: { title } } } = this.props;
    return (
      <div>
        <Helmet title="Creat a Question" />
        <Breadcrumbs
          path={fromJS([
            {
              link: '/advice',
              title: 'Advice',
            },
            {
              link: '',
              title: 'Create a Question',
            },
          ])}
        />
        <Banner
          title="Ask a question"
          subtitle="Have your question about medical marijuana be answered by the Lift community."
          bg={BannerBG}
          height={246}
        />
        {isLoading ?
          <div className="text-center">
            <Spinner height={548} />
          </div> :
          <div className="createQuestion row">
            <div className="row column small-12 large-expand">
              <div className="createQuestion__description column small-12">
                Complete the form below to submit your question to the community.
                If needed you may include additional information to help describe your question.
                Please make sure your question relates to one of the categories below.
              </div>
              <QuestionForm
                onSubmit={this.props.requestCreateQuestion}
                isSubmiting={isSubmiting}
                categories={categories}
                error={this.props.error}
                title={title}
              />
            </div>
            <div className="column small-12 large-shrink">
              <HelpfulLinks />
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToPtops = (state) => ({
  isLoading: state.getIn(['adviceCreateQuestion', 'categories', 'isLoading']),
  categories: state.getIn(['adviceCreateQuestion', 'categories', 'data', 'hits']),
  isSubmiting: state.getIn(['adviceCreateQuestion', 'questionForm', 'isLoading']),
  error: state.getIn(['adviceCreateQuestion', 'questionForm', 'error']),
});

const mapDispatchToProps = (dispatch) => ({
  requestCreateQuestion: (payload) => dispatch(requestCreateQuestion(payload)),
  requestCategories: () => dispatch(requestCategories()),
});

export default connect(mapStateToPtops, mapDispatchToProps)(CreateQuestionPage);
