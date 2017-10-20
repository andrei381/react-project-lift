// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';
import AdviceSearch from 'containers/Advice/Search';
import Spinner from 'components/Spinner';

import BannerBG from './banner.jpg';
import { requestCategories } from './sagas';

type Props = {
  params?: Object,
  requestCategories: Function,
  categories: List<*>,
  isLoading: boolean,
};

class AdvicePage extends Component {
  componentDidMount() {
    const slug = this.props.params ? this.props.params.slug : null;
    this.props.requestCategories(slug);
  }

  props: Props
  render() {
    const { categories, isLoading } = this.props;
    const slug = this.props.params ? this.props.params.slug : null;
    const category = categories ? categories.find((cat) => (cat.get('slug') === slug)) : null;
    const bannerTitle = category ? category.get('name') : 'Questions & Answers on Medical Marijuana';
    const bannerDescription = category ? category.get('description') : 'Advice on health, laws and regulations, strains, producers, doctors and more. Ask a question and help other members.';
    const bennerUrl = category && category.get('bannerPhoto') ? category.get('bannerPhoto') : BannerBG;
    return (
      <div>
        <Helmet title="Advice" />
        <Breadcrumbs
          path={fromJS([
            {
              link: '',
              title: 'Advice',
            },
          ])}
        />
        <Banner
          title={bannerTitle}
          titleElement="h2"
          subtitle={bannerDescription}
          bg={bennerUrl}
          height={246}
        />
        {isLoading ?
          <div className="text-center">
            <Spinner height={548} />
          </div> :
          <AdviceSearch
            categories={categories}
            slug={slug}
          />
        }
      </div>
    );
  }
}

const mapStateToPtops = (state) => ({
  isLoading: state.getIn(['advice', 'categories', 'isLoading']),
  categories: state.getIn(['advice', 'categories', 'data', 'hits']),
});

const mapDispatchToProps = (dispatch) => ({
  requestCategories: () => dispatch(requestCategories()),
});

export default connect(mapStateToPtops, mapDispatchToProps)(AdvicePage);
