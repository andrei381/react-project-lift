// @flow

import React from 'react';
import ProgressBar from 'react-progressbar.js';
import cx from 'classnames';

import './styles.scss';

const Line = ProgressBar.Line;

type Props = {
  value: number,
  maxValue?: number,
  className?: string,
  color?: string,
  tailColor?: string,
  width?: number,
  trailWidth?: number,
};

const ProgressBarComponent = ({ value = 0, maxValue = 1, className, tailColor = '#f0f2f7', trailWidth = 2, color = '#333333', width = 2 }: Props) => {
  const mergedClassName = cx('progressBar', className);
  const options = {
    strokeWidth: width,
    color,
    width,
    tailColor,
    trailWidth,
  };
  const progressValue = parseFloat(value) / parseFloat(maxValue);
  return (
    <Line
      progress={progressValue}
      options={options}
      initialAnimate
      containerClassName={mergedClassName}
    />
  );
};

export default ProgressBarComponent;
