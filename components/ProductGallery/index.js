// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';

import Gallery from './Gallery';

import './styles.scss';

type Props = {
  data: Map<number, string>,
  title: string,
}

class ProductGallery extends Component {
  state = {
    activeSlide: 0,
  }
  props: Props
  render() {
    const { data, title } = this.props;
    return (
      <div className="productGallery text-center">
        { data.get(0) &&
          <img
            className="productGallery__img"
            src={data.get(this.state.activeSlide)}
            alt={title}
          />
        }
        {data.size > 1 &&
          <div className="productGallery__carousel">
            <Gallery
              onSlideSelect={(i) => { this.setState({ activeSlide: i }); }}
              data={data}
            />
          </div>
        }
      </div>
    );
  }
}

export default ProductGallery;
