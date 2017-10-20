// @flow

import React from 'react';

import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  glyph: string,
  onClick?: Function,
  title: string,
  count: number,
}

const ProductAction = ({ glyph, onClick, title, count }: Props) => (
  <div // eslint-disable-line jsx-a11y/no-static-element-interactions
    className="productAction"
    onClick={onClick}
  >
    <Icon
      className="productAction__icon"
      glyph={glyph}
      size={11}
    />
    {title} ({count})
  </div>
);

export default ProductAction;
