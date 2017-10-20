// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import CustomSelect from 'components/CustomSelect';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import transformOptions from 'utils/transformOptions';
import { QUESTIONS_FILTER_SORT_OPTIONS } from 'containers/constants';

type Props = {
  onChangeFilters: Function,
  categories: List<*>,
  defaultCategory?: string,
};

type State = {
  questionState: Array<string>,
  category: any,
  sortBy: any,
};

class AdviceFilter extends Component {

  constructor(props: Object) {
    super(props);
    this.state = {
      questionState: ['open'],
      category: props.defaultCategory ? props.defaultCategory : 'all',
      sortBy: '-createdOn',
    };
  }
  state: State
  onCategoryChange = (data: Object, path: string) => {
    this.setState({ category: data });
    this.props.onChangeFilters(path, data.value);
  }
  onSortChange = (data: Object, path: string) => {
    this.setState({ sortBy: data });
    this.props.onChangeFilters(path, data.value);
  }
  questionStateChanged = (questionState: Array<string>) => {
    this.setState({
      questionState: questionState.length === 0 ? this.state.questionState : [questionState[1]],
    }, () => {
      this.props.onChangeFilters(['questionState'], this.state.questionState[0]);
    });
  }
  props: Props
  render() {
    const { categories } = this.props;
    return (
      <div>
        <div className="row align-middle mb-xxl">
          <div className="small-12 medium-4 column mb-mn">
            <div className="row align-middle">
              <div className="shrink column npr t-uppercase"><label htmlFor="category">Category: </label></div>
              <div className="column">
                <CustomSelect
                  className="large"
                  name="category"
                  onChange={this.onCategoryChange}
                  meta={['category']}
                  value={this.state.category}
                  clearable={false}
                  options={transformOptions(categories.toJS(), true)}
                />
              </div>
            </div>
          </div>
          <div className="small-12 medium-4 column mb-mn">
            <div className="row align-middle">
              <div className="shrink column npr t-uppercase"><label htmlFor="select1">Sort by: </label></div>
              <div className="column">
                <CustomSelect
                  className="large"
                  name="sort"
                  onChange={this.onSortChange}
                  meta={['sort']}
                  value={this.state.sortBy}
                  clearable={false}
                  options={QUESTIONS_FILTER_SORT_OPTIONS}
                />
              </div>
            </div>
          </div>
          <CheckboxGroup
            name="questionState"
            value={this.state.questionState}
            onChange={this.questionStateChanged}
            className="small-12 medium-4 column"
          >
            <div className="row mb-mn">
              <div className="shrink column">
                <Checkbox
                  id="checkboxOpen"
                  value="open"
                  className="checkbox__input"
                /><label htmlFor="checkboxOpen">Open Questions</label>
              </div>
              <div className="shrink column">
                <Checkbox
                  id="checkboxClosed"
                  value="closed"
                  className="checkbox__input"
                />
                <label htmlFor="checkboxClosed">Closed Questions</label>
              </div>
            </div>
          </CheckboxGroup>
        </div>
      </div>
    );
  }
}

export default AdviceFilter;
