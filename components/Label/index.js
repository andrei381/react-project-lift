// @flow

import React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  className?: string,
  hasArrow?: boolean,
  children?: React$Element<any>,
}

const Button = ({ className, children, hasArrow }: Props) => {
  const mergedClassName = cx('label', className, (hasArrow ? 'label--hasArrow' : ''));
  return (
    <div className={mergedClassName}>{children}</div>
  );
};

export default Button;
