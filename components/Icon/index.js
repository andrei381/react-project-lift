// @flow

import React from 'react';

type Props = {
  glyph: Object,
  width?: number,
  height?: number,
  size?: number,
  className?: string,
  onClick?: Function,
}

const Icon = ({ glyph, width, height, size, className, onClick }: Props) => (
  <svg
    className={className}
    width={width || size}
    height={height || size}
    onClick={onClick}
    viewBox={glyph.viewBox}
  >
    <use xlinkHref={`#${glyph.id}`} />
  </svg>
);

Icon.defaultProps = {
  size: 14,
};

export default Icon;
