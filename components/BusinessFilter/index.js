// @flow

import React, { Component } from 'react';
import Button from 'components/Button';
import CustomSelect from 'components/CustomSelect';
import SearchField from 'components/SearchField';
import { FILTER_PROVINCE_OPTIONS, FILTER_SHOW_OPTIONS, BUSINESS_FILTER_SORT_OPTIONS } from 'containers/constants';
import './styles.scss';

type Props = {
  requestBusinesses: Function,
  filter: Object,
  model: Object,
}

class BusinessFilter extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      filterVisible: true,
      searchValue: '',
      typingTimeOut: 0,
    };
  }

  state: {
    filterVisible: boolean,
    searchValue: string,
    typingTimeOut: number,
  }

  componentWillMount() {
    const { filter } = this.props;
    this.setState({
      searchValue: filter.getIn(['query', 'q'], ''),
    });
    this.props.requestBusinesses();
  }
  onInputChange = (value: string) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    const timeoutId = setTimeout(() => {
      this.searchBusiness(this.state.searchValue);
    }, 1000);
    this.setState({
      searchValue: value,
      typingTimeout: timeoutId,
    });
  }
  onProvinceChange = (value: Object, path: string) => {
    this.props.requestBusinesses(path, value);
  }
  onSelectChange = (value: Object, path: string) => {
    this.props.requestBusinesses(path, value);
  }
  searchBusiness = (value: string) => {
    this.props.requestBusinesses(['query', 'q'], value);
  }
  toggleFilter = () => {
    this.setState({ filterVisible: !this.state.filterVisible });
  }
  props: Props
  render() {
    const { filterVisible } = this.state;
    const { model } = this.props;
    return (
      <div className="businessFilter mb-xl">
        <div className="businessFilter__top row align-middle">
          <div className="column mb-md">
            <SearchField
              className="dark"
              onChange={this.onInputChange}
              value={this.state.searchValue}
            />
          </div>
          <div className="shrink column mb-md">
            <Button
              className="businessFilter__toggle"
              element="button"
              onClick={this.toggleFilter}
            >
              {filterVisible ? 'Hide' : 'Show'} filter
            </Button>
          </div>
        </div>

        {filterVisible && <div className="row mt-md mb-md">
          <div className="column medium-4 small-12">
            <div className="row align-middle mb-md">
              <div className="shrink column npr">
                <div className="businessFilter__label fs-tn">Show</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onSelectChange}
                  meta={['model', 'perPage']}
                  value={model.get('perPage').toJS()}
                  clearable={false}
                  options={FILTER_SHOW_OPTIONS}
                />
              </div>
            </div>
          </div>
          <div className="column medium-4 small-12">
            <div className="filter__topItem row align-middle">
              <div className="shrink column npr">
                <div className="filter__label">Sort by</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onSelectChange}
                  meta={['model', 'sort']}
                  value={model.get('sort').toJS()}
                  clearable={false}
                  options={BUSINESS_FILTER_SORT_OPTIONS}
                />
              </div>
            </div>
          </div>
          <div className="column medium-4 small-12">
            <div className="row align-middle mb-md">
              <div className="shrink column npr">
                <div className="businessFilter__label fs-tn t-uppercase">Province</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onProvinceChange}
                  meta={['model', 'province']}
                  value={model.get('province').toJS()}
                  clearable={false}
                  options={FILTER_PROVINCE_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default BusinessFilter;
