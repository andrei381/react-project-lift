// @flow

import React, { Component } from 'react';
import { fromJS, List } from 'immutable';
import type { List as ListType } from 'immutable';
import { generate } from 'shortid';

import SearchField from 'components/SearchField';
import QuestionInfo from 'components/Advice/Question/Info';
import AdviceFilter from 'components/Advice/Filter';
import Pagination from 'components/Pagination';
import Spinner from 'components/Spinner';

import './styles.scss';

type Props = {
  slug?: string,
  categories: List<*>,
  questions: Object,
  isLoading: boolean,
  pages: number,
  requestQuestions: Function,
  push: Function,
}

class AdviceSearch extends Component {
  constructor(props: Props) {
    super(props);
    const { slug, categories } = props;
    const category = categories.find((cat) => (cat.get('slug') === slug));
    const catId = category ? category.get('_id') : 'all';
    this.state = {
      filter: fromJS({
        category: catId || 'all',
        sort: '-createdOn',
        questionState: 'open',
        page: 1,
        per_page: 10,
      }),
    };
  }

  state: {
    filter: Object,
  }
  componentDidMount() {
    this.props.requestQuestions(this.state.filter);
  }
  componentWillReceiveProps(newProps: Props) {
    const { slug, categories } = newProps;
    if (slug !== this.props.slug) {
      const category = categories.find((cat) => (cat.get('slug') === slug));
      const catId = category ? category.get('_id') : 'all';
      this.setState({
        filter: this.state.filter.set('category', catId),
      }, () => {
        this.props.requestQuestions(this.state.filter);
      });
    }
  }
  onChangeFilters = (path: Array<string>, value: string) => {
    if (path[0] === 'category') {
      this.props.push(`/advice/${value}`);
      return;
    }
    const { filter } = this.state;
    this.setState({
      filter: filter.setIn(path, value),
    }, () => {
      this.props.requestQuestions(this.state.filter);
    });
  }
  onSubmit = (title: string) => {
    this.props.push(`/advice/create-question?title=${encodeURIComponent(title)}`);
  }
  props: Props

  renderQuestions = (questions: ListType<Map<string, string>>, categories: ListType<Map<string, string>>) => (
    <div>
      {
        questions.map((question) => {
          const category = categories.find((cat) => (cat.get('_id') === question.get('category')));
          return (
            <QuestionInfo
              key={generate()}
              className="row column"
              question={fromJS(question)}
              category={category}
            />
          );
        })
      }
    </div>
  );

  render() {
    const { isLoading, questions, categories, pages } = this.props;
    const { filter } = this.state;
    return (
      <div>
        <div>
          <div className="adviceSearch ">
            <div className="row">
              <div className="column">
                <SearchField
                  className="dark large"
                  onSubmit={(e) => this.onSubmit(e)}
                  placeholder={'Need something answered? Ask here.'}
                />
              </div>
            </div>
          </div>
          <div className="adviceFilter">
          </div>
        </div>
        <AdviceFilter
          categories={categories}
          filter={filter}
          onChangeFilters={this.onChangeFilters}
          defaultCategory={this.props.slug}
        />
        {isLoading ?
          <div className="text-center">
            <Spinner height={548} />
          </div> :
          this.renderQuestions(questions, categories)
        }
        <Pagination
          initialPage={1}
          pageCount={pages}
          onPageChange={(e) => this.onChangeFilters(['page'], e)}
        />
      </div>
    );
  }
}

export default AdviceSearch;

