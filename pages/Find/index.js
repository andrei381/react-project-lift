// @flow

import React from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import NewsletterSignup from 'components/NewsletterSignup';
import HighlightCards from 'components/HighlightCards';

import DrImg from './find-doctor.jpg';
import ProducerImg from './find-producer.jpg';
import DispensaryImg from './find-dispensary.png';

const cards = fromJS([
  {
    src: DrImg,
    title: 'Find a doctor',
    desc: 'Scroll through our approved list of clinics and physicians near you',
    btnText: 'Browse',
    linkTo: '/doctors',
  }, {
    src: ProducerImg,
    title: 'Find a licensed producer',
    desc: 'Read through patient reviews, register as a patient and find all the company information you need',
    btnText: 'Browse',
    linkTo: '/producers',
  }, {
    src: DispensaryImg,
    title: 'Find a dispensary',
    desc: 'We can help you find a local dispensary near you',
    btnText: 'Browse',
    linkTo: '/dispensaries',
  },
]);
const Find = () => (
  <div>
    <Helmet title="Find" />
    <Breadcrumbs
      path={fromJS([
        {
          link: '',
          title: 'Find',
        },
      ])}
    />
    <div className="row column">
      <h1 className="c-secondary mb-lg t-capitalize">find it with lift</h1>
    </div>
    <HighlightCards cards={cards} />
    <NewsletterSignup />
  </div>
);

export default Find;
