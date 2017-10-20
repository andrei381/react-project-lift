// @flow

import React from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import BorderedTitle from 'components/BorderedTitle';
import FeatureList from 'components/FeatureList';

import Img from './504.png';

const FiveOneFourPage = () => (
  <div>
    <Helmet title="Register" />
    <Breadcrumbs
      path={fromJS([
        {
          link: '',
          title: '504',
        },
      ])}
    />
    <div className="row column text-center">
      <img
        src={Img}
        alt="Lift 504 Page"
      />
      <BorderedTitle
        centered
        element="h1"
        className="c-secondary mb-lg t-capitalize"
      >
        Undergoing Maintenance.  Try one of these instead.
      </BorderedTitle>
    </div>
    <FeatureList className="mb-hg" />
  </div>
);

export default FiveOneFourPage;
