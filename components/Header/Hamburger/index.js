// @flow

import React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  closeNavbar: Function,
  openNavbar: Function,
  isActive: boolean,
};

const Hamburger = ({ closeNavbar, openNavbar, isActive }: Props) => {
  const className = cx('hamburger', { 'hamburger--active': isActive });
  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className={className}
      onClick={() => isActive ? closeNavbar() : openNavbar()}
      role="button"
    >
      <span className="hamburger__inner" />
      <span className="hamburger__inner" />
      <span className="hamburger__inner" />
    </div>
  );
};

export default Hamburger;
