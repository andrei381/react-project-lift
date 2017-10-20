// @flow

import React from 'react';

// Styles for this component are in the head of index.html

type Props = {
  height?: number,
}

const Preloader = ({ height }: Props) => (
  <div
    className="preloader"
    style={{ height }}
  >
    <div className="preloader__bounce preloader__bounce--1" />
    <div className="preloader__bounce preloader__bounce--2" />
    <div className="preloader__bounce preloader__bounce--3" />
  </div>
);

export default Preloader;
