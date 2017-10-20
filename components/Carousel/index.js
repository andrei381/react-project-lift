// @flow

import React, { Component } from 'react';
import Slick from 'react-slick';

import './styles.scss';

type Props = {
  children?: React.Element<any>
}

class Carousel extends Component {
  props: Props
  render() {
    return (
      <Slick {...this.props}>{this.props.children}</Slick>
    );
  }
}

export default Carousel;
