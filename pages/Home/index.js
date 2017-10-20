// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'components/Helmet';
import type { List } from 'immutable';

import Banner from 'components/Banner';
import FilterableProducts from 'containers/FilterableProducts';
import News from 'components/News';
import FeatureList from 'components/FeatureList';

import { requestRecentNews } from './sagas';

type Props = {
  requestRecentNews: Function,
  news: List<Object>,
};

class HomePage extends Component {
  componentDidMount() {
    this.props.requestRecentNews();
  }
  props: Props
  render() {
    return (
      <div>
        <Helmet title="Home" />
        <Banner />
        <FilterableProducts
          category="strains"
          linksTo="/strains"
        />
        <FilterableProducts
          category="oils"
          linksTo="/oils"
        />
        <News data={this.props.news} />
        <FeatureList />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  news: state.getIn(['home', 'news']),
});

const mapDispatchToProps = (dispatch) => ({
  requestRecentNews: () => dispatch(requestRecentNews()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
