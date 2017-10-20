// @flow

import React from 'react';
import Rating from 'react-rating';
import cx from 'classnames';

import Icon from 'components/Icon';

import Star from 'images/sprite/star.svg';
import StarHollow from 'images/sprite/star-hollow.svg';
import './styles.scss';

type Props = {
  initialRate: number,
  className?: string,
  onChange?: Function,
  onRate?: Function,
  readonly?: boolean,
  size?: number,
};

const StarRating = ({ initialRate, className, readonly = true, onChange, onRate, size = 16 }: Props) => {
  const mergedClassName = cx('starRating', className);
  return (
    <Rating
      className={mergedClassName}
      initialRate={initialRate}
      readonly={readonly}
      onChange={onChange}
      onRate={onRate}
      empty={
        <Icon
          glyph={StarHollow}
          size={size}
        />
      }
      full={
        <Icon
          glyph={Star}
          size={size}
        />
      }
    />
  );
};

export default StarRating;
