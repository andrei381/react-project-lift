// @flow

import React from 'react';
import Link from 'components/Link';

import './styles.scss';

const SecondaryMenu = () => (
  <ul className="secondaryMenu">
    <li className="secondaryMenu__item">
      <a
        href="http://support.lift.co"
        target="_blank"
      >Support</a>
    </li>
    <li className="secondaryMenu__item">
      <Link
        className="secondaryMenu__link"
        to="/advice"
      >Advice Forum</Link>
    </li>
  </ul>
);

export default SecondaryMenu;
