// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';

import Helmet from 'components/Helmet';
import Breadcrumbs from 'components/Breadcrumbs';
import BusinessesList from 'components/BusinessesList';
import Preloader from 'components/Preloader';
import Pagination from 'components/Pagination';

import { requestBusinesses } from 'containers/BusinessSearch/sagas';
import BusinessFilter from 'components/BusinessFilter';

type Props = {
  category: string,
  businesses: List<*>,
  isLoading: boolean,
  total: number,
  filter: Object,
  pages: number,
  show: number,
  page: number,
  requestBusinesses: Function,
  model: Object,
};

class BusinessSearchContainer extends Component {

  props: Props
  render() {
    const { category, filter, model, businesses, isLoading, total, pages, show, page } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '/find',
        title: 'Find',
      },
      {
        link: '',
        title: `${category}`,
      },
    ]);
    return (
      <div>
        <Helmet title={`${category}`} />
        <Breadcrumbs
          path={breadcrumbPath}
        />
        <div className="row column">
          <h1 className="c-secondary mb-lg t-capitalize">{category}</h1>
        </div>
        <BusinessFilter
          filter={filter}
          requestBusinesses={(path, value) => this.props.requestBusinesses(category, path, value)}
          model={model}
        />
        {isLoading ?
          <div className="text-center">
            <Preloader height={548} />
          </div> :
          <BusinessesList
            data={businesses}
            province={model.get('province')}
            category={category}
            total={total}
            show={show}
            page={page}
          />
        }
        <Pagination
          initialPage={1}
          pageCount={pages}
          onPageChange={(e) => this.props.requestBusinesses(category, ['model', 'page'], e)}
        />

      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  filter: state.getIn(['businessSearch', props.category, 'filter']),
  businesses: state.getIn(['businessSearch', props.category, 'data', 'hits']),
  total: state.getIn(['businessSearch', props.category, 'data', 'count']),
  pages: state.getIn(['businessSearch', props.category, 'data', 'pages']),
  isLoading: state.getIn(['businessSearch', props.category, 'isLoading']),
  show: state.getIn(['businessSearch', props.category, 'filter', 'model', 'perPage', 'value']),
  page: state.getIn(['businessSearch', props.category, 'filter', 'model', 'page']),
  model: state.getIn(['businessSearch', props.category, 'filter', 'model']),
});

const mapDispatchToProps = (dispatch) => ({
  requestBusinesses: (category, path, value) => dispatch(requestBusinesses(category, path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessSearchContainer);
