// @flow

import React from 'react';

import Icon from 'components/Icon';

import './styles.scss';

type Props = {
  glyph: string,
  size: number,
  onClick?: Function,
}

const CartAction = ({ glyph, size, onClick }: Props) => (
  <div // eslint-disable-line jsx-a11y/no-static-element-interactions
    className="cartAction"
    onClick={onClick}
  >
    <Icon
      className="cartAction__icon"
      glyph={glyph}
      size={size}
    />
  </div>
);

export default CartAction;
