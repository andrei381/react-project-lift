// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProductsCarousel from 'components/ProductsCarousel';
import { requestProducts } from 'pages/Shop/sagas';

type Props = {
  items: Object,
  category: string,
  title: string,
  requestProducts: Function,
};

class ProductsCarouselContainer extends Component {
  componentWillMount() {
    this.props.requestProducts(this.props.category);
  }
  props: Props
  render() {
    return (
      <ProductsCarousel
        category={this.props.category}
        title={this.props.title}
        data={this.props.items}
        requestItems={(category) => this.props.requestProducts(category)}
      />
    );
  }
}

const mapStateToPtops = (state, props) => ({
  items: state.getIn(['shop', props.category]),
});

const mapDispatchToProps = (dispatch) => ({
  requestProducts: (category) => dispatch(requestProducts(category)),
});

export default connect(mapStateToPtops, mapDispatchToProps)(ProductsCarouselContainer);
