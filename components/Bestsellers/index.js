// @flow

import React from 'react';
import { Link } from 'react-router';

import Button from 'components/Button';

import OilsImg from './oils.jpg';
import AccessoriesImg from './pax.jpg';
import './styles.scss';

const Bestsellers = () => (
  <div className="bestsellers row">
    <div className="bestsellers__item small-12 medium-6 column">
      <img
        className="mb-lg"
        src={AccessoriesImg}
        role="presentation"
        alt="Best Selling Accessories"
      />
      <h2>Top-rated accessories</h2>
      <Button
        className="secondary"
        element={Link}
        to="/products"
      >Browse</Button>
    </div>
    <div className="bestsellers__item small-12 medium-6 column">
      <img
        className="mb-lg"
        src={OilsImg}
        role="presentation"
        alt="Best Selling Oils"
      />
      <h2>Top-rated oils & extracts</h2>
      <Button
        className="secondary"
        element={Link}
        to="/oils"
      >Browse</Button>
    </div>
  </div>
);

export default Bestsellers;
