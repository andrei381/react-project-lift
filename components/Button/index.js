// @flow

import React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  element?: any,
  className?: string,
  children?: React.Element<any>,
  onClick?: Function,
  to?: string,
  type?: string,
  activeClassName?: string,
  disabled?: boolean,
}

const Button = (props: Props) => {
  const { className, element = 'a', children, onClick, to, type, activeClassName, disabled } = props;
  const mergedClassName = cx('button', className);
  const actualProps: Object = {
    className: mergedClassName,
    onClick,
    to,
    disabled,
  };
  if (activeClassName) actualProps.activeClassName = activeClassName;
  return (
    React.createElement(
      type ? 'button' : element,
      actualProps,
      [children]
    )
  );
};

export default Button;
