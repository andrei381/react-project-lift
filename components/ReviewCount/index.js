// @flow

import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

import StarRating from 'components/StarRating';

type Props = {
  reviewCount: number,
  ratingsAverage: number,
  className?: string,
  to?: string,
}

const ReviewCount = ({ reviewCount, ratingsAverage, className, to }: Props) => {
  const mergedClassName = cx('reviewCount row align-middle', className);
  return (
    <div className={mergedClassName}>
      <div className="shrink column npr">
        <StarRating initialRate={ratingsAverage} />
      </div>
      <div className="shrink column fs-tn c-primary">
        {ratingsAverage && <strong>({ratingsAverage})&nbsp;&nbsp;&nbsp;</strong>}
        <Link to={to}>{reviewCount} reviews</Link>
      </div>
    </div>
  );
};

export default ReviewCount;
