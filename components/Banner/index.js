// @flow

import React from 'react';
import { Link } from 'react-router';

import Button from 'components/Button';
import './styles.scss';

const Banner = () => (
  <div className="banner">
    <div className="banner__inner row">
      <div className="banner__content small-12 large-7 column align-self-middle">
        <h1 className="mb-xl"><strong>Earn discounts at Licensed Producers</strong>&nbsp;{'with Canada\'s only cannabis loyalty program'}</h1>
        <div className="row">
          <div className="shrink column mb-md">
            <Button
              className="large dark shadow"
              element={Link}
              to="/register"
            >Join now</Button>
          </div>
          <div className="column">
            <Button
              className="large secondary shadow"
              element={Link}
              to="/how-it-works"
            >
              How it works
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Banner;
