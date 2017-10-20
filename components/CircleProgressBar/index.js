// @flow

import React from 'react';
import cx from 'classnames';
import ProgressBar from 'react-progressbar.js';

import './styles.scss';

type Props = {
  progress: number,
  text: string,
  options: Object,
  initialAnimate: boolean,
  radius: number,
  className?: string,
}
const CircleProgressBar = ({
  progress,
  text,
  options,
  initialAnimate,
  radius,
  className,
}: Props) => {
  const containerStyle = {
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
  };
  return (<ProgressBar.Circle
    progress={progress}
    text={text}
    options={options}
    initialAnimate={initialAnimate}
    containerStyle={containerStyle}
    containerClassName={cx('circleProgressBar', className)}
  />);
};

export default CircleProgressBar;
