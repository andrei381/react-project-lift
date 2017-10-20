// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';
import CartIcon from 'images/sprite/cart.svg';
import './styles.scss';

type Props = {
  openCart: Function,
  itemCount: number,
};

class CartMenu extends Component {
  props: Props
  render() {
    const { itemCount } = this.props;
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className="cartMenu row align-middle"
        role="button"
        onClick={() => this.props.openCart()}
      >
        <div className="shrink column npl npr">
          <Icon
            glyph={CartIcon}
            width={30}
            height={25}
          />
        </div>
        {
          itemCount !== 0 && <div className="column cartMenu__count"><span>{itemCount}</span></div>
        }
      </div>
    );
  }
}

export default CartMenu;
