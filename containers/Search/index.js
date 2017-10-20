// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import Filter from 'components/Filter';
import ProductsList from 'components/ProductsList';
import Preloader from 'components/Preloader';
import Pagination from 'components/Pagination';
import { requestFilters, requestProducts, resetQuery } from 'containers/Search/sagas';
import ProductFilter from 'components/Filter/ProductFilter';

type Props = {
  category: string,
  title?: string,
  products: List<Map<string, Object>>,
  filter: Object,
  isLoading: boolean,
  requestFilters: Function,
  requestProducts: Function,
  resetQuery: Function,
  pages: number,
};

class SearchContainer extends Component {
  componentWillMount() {
    this.props.requestFilters(this.props.category);
  }
  props: Props
  render() {
    const { category, title, products, isLoading, pages, filter } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '/shop',
        title: 'Shop',
      },
      {
        link: '',
        title: `${category}s`,
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <div className="row column">
          <h1 className="c-secondary mb-lg t-capitalize">{title || category}</h1>
        </div>
        <Filter
          data={this.props.filter}
          requestProducts={(path, value) => this.props.requestProducts(category, path, value)}
          filter={filter}
          bottomComponent={
            <ProductFilter
              category={category}
              data={filter.get('data')}
              filter={filter}
              requestProducts={(path, value) => this.props.requestProducts(category, path, value)}
            />
          }
        />
        <div className="text-center">
          {isLoading ?
            <Preloader height={548} /> : <div>
              {
                products.size === 0 ? <div className="mb-xl">
                  Sorry! No products were found. Try changing your query or <a // eslint-disable-line jsx-a11y/no-static-element-interactions
                    className="c-secondary"
                    onClick={() => this.props.resetQuery(category)}
                  >resetting your search</a>
                </div> : <ProductsList data={products} />
              }
            </div>
          }
        </div>
        <Pagination
          initialPage={1}
          pageCount={Math.ceil(pages)}
          onPageChange={(e) => this.props.requestProducts(category, ['model', 'page'], e)}
        />
      </div>
    );
  }
}

const mapStateToPtops = (state, props) => ({
  products: state.getIn(['search', props.category, 'data', 'hits']),
  pages: state.getIn(['search', props.category, 'data', 'pages']),
  isLoading: state.getIn(['search', props.category, 'isLoading']),
  filter: state.getIn(['search', props.category, 'filter']),
});

const mapDispatchToProps = (dispatch) => ({
  requestFilters: (category) => dispatch(requestFilters(category)),
  requestProducts: (category, path, value) => dispatch(requestProducts(category, path, value)),
  resetQuery: (category) => dispatch(resetQuery(category)),
});

export default connect(mapStateToPtops, mapDispatchToProps)(SearchContainer);
