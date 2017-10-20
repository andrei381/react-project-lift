// @flow

import React from 'react';
import cx from 'classnames';
import './styles.scss';

type Props = {
  children?: any,
  className?: string,
  dark?: boolean,
};

const Panel = ({ children, className, dark }: Props) => {
  const mergedClassName = cx('panel', dark ? 'panel--dark' : 'panel--light', className);
  return <div className={mergedClassName}>{children}</div>;
};

export default Panel;
