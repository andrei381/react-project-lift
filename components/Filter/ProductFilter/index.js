// @flow

import React, { Component } from 'react';
import { includes } from 'lodash';
import cx from 'classnames';

import transformOptions from 'utils/transformOptions';
import CustomSelect from 'components/CustomSelect';
import { FILTER_SORT_OPTIONS, FILTER_SHOW_OPTIONS, STRAIN_TYPE_OPTIONS } from 'containers/constants';

type Props = {
  category: string,
  data: Object,
  requestProducts: Function,
  filter: Object,
}

class ProductFilter extends Component {
  onSelectChange = (value: Object, path: string) => {
    this.props.requestProducts(path, value);
  }
  onInputChange = (value: string) => {
    this.props.requestProducts(['query', 'q'], value);
  }
  props: Props
  render() {
    const { data, filter, category } = this.props;
    return (
      <div>
        <div className="filter__bottom row">
          <div
            className={cx('column small-12', { 'medium-4': category === 'Strain',
              'medium-6': category !== 'Strain' })}
          >
            <div className="filter__topItem row align-middle">
              <div className="shrink column npr">
                <div className="filter__label">Show</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onSelectChange}
                  meta={['model', 'per_page']}
                  value={filter.getIn(['model', 'per_page']).toJS()}
                  clearable={false}
                  options={FILTER_SHOW_OPTIONS}
                />
              </div>
            </div>
          </div>
          {
            category === 'Strain' ? <div className="column medium-4 small-12">
              <div className="filter__topItem row align-middle">
                <div className="shrink column npr">
                  <div className="filter__label">Type</div>
                </div>
                <div className="column">
                  <CustomSelect
                    className="large"
                    onChange={this.onSelectChange}
                    meta={['query', 'type']}
                    value={filter.getIn(['query', 'type']) ? filter.getIn(['query', 'type']).toJS() : null}
                    options={STRAIN_TYPE_OPTIONS}
                  />
                </div>
              </div>
            </div> : null
          }
          <div
            className={cx('column small-12', { 'medium-4': category === 'Strain',
              'medium-6': category !== 'Strain' })}
          >
            <div className="filter__topItem row align-middle">
              <div className="shrink column npr">
                <div className="filter__label">Sort by</div>
              </div>
              <div className="column">
                <CustomSelect
                  className="large"
                  onChange={this.onSelectChange}
                  meta={['model', 'sort']}
                  value={filter.getIn(['model', 'sort']) ? filter.getIn(['model', 'sort']).toJS() : null}
                  options={FILTER_SORT_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="productFilter row">
          {data.entrySeq().map(([key, value]) => {
            const hiddenFilters = ['name', 'positiveEffects', 'negativeEffects', 'names', 'types'];
            let label;
            switch (key) {
              case ('producer_name'):
                label = 'producer';
                break;
              case ('prescribedFor'):
                label = 'prescribed for';
                break;
              default:
                label = key;
            }
            if (!includes(hiddenFilters, key)) {
              return (
                <div
                  className="column medium-3 small-12"
                  key={key}
                >
                  <div className="filter__label">{label}</div>
                  <CustomSelect
                    className="large"
                    onChange={this.onSelectChange}
                    meta={['query', key]}
                    value={filter.getIn(['query', key]) ? filter.getIn(['query', key]).toJS() : null}
                    multi
                    options={transformOptions(value.toJS())}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
}

export default ProductFilter;
