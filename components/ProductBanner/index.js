// @flow

import React from 'react';
import { Link } from 'react-router';

import Button from 'components/Button';

import Img from './bg.jpg';
import './styles.scss';

const ProductBanner = () => (
  <div className="row column">
    <div className="productBanner">
      <img
        src={Img}
        role="presentation"
        alt="Best Selling Strains"

      />
      <div className="productBanner__content">
        <h1 className="productBanner__title">Our highest-rated strains</h1>
        <Button
          className="large secondary"
          element={Link}
          to="/strains"
        >Browse</Button>
      </div>
    </div>
  </div>
);

export default ProductBanner;
