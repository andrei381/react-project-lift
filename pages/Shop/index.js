// @flow

import React from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import NewsletterSignup from 'components/NewsletterSignup';
import ProductBanner from 'components/ProductBanner';
import Bestsellers from 'components/Bestsellers';
import ProductsCarousel from 'containers/ProductsCarousel';

const HomePage = () => (
  <div>
    <Helmet title="Shop" />
    <Breadcrumbs
      path={fromJS([
        {
          link: '',
          title: 'Shop',
        },
      ])}
    />
    <ProductBanner />
    <Bestsellers />
    <ProductsCarousel category="strains" />
    <ProductsCarousel category="accessories" />
    <ProductsCarousel
      category="oils"
      title="oils & extracts"
    />
    <NewsletterSignup />
  </div>
);

export default HomePage;
