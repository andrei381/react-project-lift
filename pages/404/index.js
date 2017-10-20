// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import BorderedTitle from 'components/BorderedTitle';
import FeatureList from 'components/FeatureList';

import Img from './404.png';

type Props = {
  replace: Function,
}

class FourOneFourPage extends Component {
  componentDidMount() { this.props.replace('/404'); }
  props: Props
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: '404',
      },
    ]);
    return (
      <div>
        <Helmet title="404" />
        <Breadcrumbs path={breadcrumbPath} />
        <div className="row column text-center">
          <img
            src={Img}
            alt="Lift 404 Page"
          />
          <BorderedTitle
            centered
            element="h1"
            className="c-secondary mb-lg t-capitalize"
          >
            This is not what you are looking for.  Try one of these instead.
          </BorderedTitle>
        </div>
        <FeatureList className="mb-hg" />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  replace: (path) => dispatch(replace(path)),
});

export default connect(null, mapDispatchToProps)(FourOneFourPage);
