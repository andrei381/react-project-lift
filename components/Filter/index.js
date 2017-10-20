// @flow

import React, { Component } from 'react';

import Button from 'components/Button';
import SearchField from 'components/SearchField';
import './styles.scss';

type Props = {
  requestProducts: Function,
  filter: Object,
  bottomComponent?: Object,
}

class Filter extends Component {
  state = {
    filterVisible: false,
    searchValue: '',
    typingTimeOut: 0,
  }
  componentWillMount() {
    const { filter } = this.props;
    this.setState({
      searchValue: filter.getIn(['query', 'q'], ''),
    });
    this.props.requestProducts();
  }

  componentWillReceiveProps(newProps: Props) {
    this.setState({
      searchValue: newProps.filter.getIn(['query', 'q'], ''),
    });
  }

  onInputChange = (value: string) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    const timeoutId = setTimeout(() => {
      this.searchProduct(this.state.searchValue);
    }, 1000);
    this.setState({
      searchValue: value,
      typingTimeout: timeoutId,
    });
  }
  onSelectChange = (value: Object, path: string) => {
    this.props.requestProducts(path, value);
  }
  searchProduct = (value: string) => {
    this.props.requestProducts(['query', 'q'], value);
  }
  toggleFilter = () => {
    this.setState({ filterVisible: !this.state.filterVisible });
  }
  props: Props
  render() {
    const { filterVisible } = this.state;
    const { bottomComponent } = this.props;
    return (
      <div className="filter">
        <div className="filter__top row align-middle">
          <div className="filter__topItem column">
            <SearchField
              className="dark"
              onChange={this.onInputChange}
              value={this.state.searchValue}
            />
          </div>
          <div className="filter__topItem shrink column">
            <Button
              className="filter__toggle"
              element="button"
              onClick={this.toggleFilter}
            >
              {filterVisible ? 'Hide' : 'Show'} filter
            </Button>
          </div>
        </div>
        {filterVisible &&
          bottomComponent
        }
      </div>
    );
  }
}

export default Filter;
