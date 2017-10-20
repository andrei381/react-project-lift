// @flow

import React from 'react';
import Helmet from 'react-helmet';

import BorderedTitle from 'components/BorderedTitle';
import terms from './terms';

const TermsAndConditions = () => (
  <div className="mb-lg">
    <Helmet title="Terms and Conditions" />
    <div className="row column">
      <BorderedTitle centered>Terms and Conditions</BorderedTitle>
      <div dangerouslySetInnerHTML={{ __html: terms.liftRewardsToS }}></div>
    </div>
  </div>
);

export default TermsAndConditions;
