// @flow

import React from 'react';
import { Link } from 'react-router';

type Props = {
  to: string,
  children?: any,
  className?: string,
  activeClassName?: string,
}

const CustomLink = ({ to, className, activeClassName, children, ...otherProps }: Props) => {
  const regex = new RegExp('^http', 'i');
  const isExternal = regex.test(to);
  const actualProps: Object = {
    className,
    to,
    ...otherProps,
  };
  if (isExternal) {
    actualProps.href = to;
  } else {
    actualProps.to = to;
    actualProps.activeClassName = activeClassName;
  }
  return React.createElement(
    isExternal ? 'a' : Link,
    actualProps,
    [children]
  );
};

export default CustomLink;
