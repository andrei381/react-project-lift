// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import Header from 'containers/Header';
import Footer from 'components/Footer';
import ShoppingCart from 'components/ShoppingCart';

import {
  logout,
  openCart,
  closeCart,
  updateCart,
  trackCheckout,
  trackAddProduct,
  trackRemoveProduct,
  requestUser,
} from 'containers/App/sagas';

type Props = {
  children: React.Element<any>,
  user: Object,
  logout: Function,
  openCart: Function,
  closeCart: Function,
  updateCart: Function,
  trackCheckout: Function,
  trackAddProduct: Function,
  trackRemoveProduct: Function,
  replace: Function,
  requestUser: Function,
  cart: Object,
};

class App extends Component {
  componentWillMount() {
    const { user } = this.props;
    if (user) {
      this.props.requestUser();
    }
  }
  props: Props
  render() {
    const { user, children, cart } = this.props;
    return (
      <div>
        <Header
          user={user}
          logout={this.props.logout}
          openCart={this.props.openCart}
          replace={this.props.replace}
          itemCount={cart.get('itemCount')}
        />
        {React.Children.toArray(children)}
        <Footer />
        <ShoppingCart
          open={cart.get('open')}
          itemCount={cart.get('itemCount')}
          closeCart={this.props.closeCart}
          updateCart={this.props.updateCart}
          trackCheckout={this.props.trackCheckout}
          trackAddProduct={this.props.trackAddProduct}
          trackRemoveProduct={this.props.trackRemoveProduct}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.getIn(['app', 'user']),
  cart: state.getIn(['app', 'cart']),
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  openCart: () => dispatch(openCart()),
  closeCart: () => dispatch(closeCart()),
  updateCart: (itemCount) => dispatch(updateCart(itemCount)),
  trackCheckout: () => dispatch(trackCheckout()),
  trackAddProduct: (product) => dispatch(trackAddProduct(product)),
  trackRemoveProduct: (product) => dispatch(trackRemoveProduct(product)),
  replace: (path) => dispatch(replace(path)),
  requestUser: () => dispatch(requestUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

