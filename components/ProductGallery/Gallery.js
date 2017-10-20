// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';
import Carousel from 'components/Carousel';
import { generate } from 'shortid';

type Props = {
  data: Map<number, string>,
  onSlideSelect: Function,
}

const carouselSettings = {
  slidesToShow: 3,
  slidesToScroll: 3,
  infinite: false,
  focusOnSelect: false,
  variableWidth: true,
};

class Gallery extends Component {
  shouldComponentUpdate() {
    return false; // without it react-slick rerenders when outer state changes because of the bug: https://github.com/akiran/react-slick/pull/700
  }
  props: Props
  render() {
    const { data } = this.props;
    return (
      <Carousel
        {...carouselSettings}
        className="variable-width"
      >
        {data.map((item: string, i: number) => (
          <div key={generate()}>
            <div // eslint-disable-line jsx-a11y/no-static-element-interactions
              className="productGallery__carouselImg"
              style={{
                backgroundImage: `url(${item})`,
              }}
              onClick={() => { this.props.onSlideSelect(i); }}
            />
          </div>
        ))}
      </Carousel>
    );
  }
}

export default Gallery;
