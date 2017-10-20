// @flow

import React from 'react';
import Slider from 'react-rangeslider';
import cx from 'classnames';

import './styles.scss';

type Props = {
  minValue?: number,
  maxValue?: number,
  step?: number,
  value?: number,
  className?: string,
  onChange: Function,
};

const RangeSlider = ({ minValue = 0, maxValue = 10, value = 0, step = 1, className, onChange }: Props) => {
  const mergedClassName = cx('rangeSlider', className);
  return (
    <div className={mergedClassName}>
      <div className="rangeSlider__label">
        {minValue}
      </div>
      <div className="rangeSlider__slider">
        <Slider
          min={minValue}
          max={maxValue}
          step={step}
          value={value}
          tooltip
          onChange={onChange}
        />
      </div>
      <div className="rangeSlider__label rangeSlider__label--right">
        {maxValue}
      </div>
    </div>
  );
};

export default RangeSlider;
