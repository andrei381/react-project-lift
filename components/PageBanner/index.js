// @flow

import React from 'react';
import cx from 'classnames';

import './styles.scss';

type Props = {
  title?: string,
  titleLarge?: boolean,
  subtitle?: string,
  bg: string,
  bottomComponent?: React$Element<any>,
  height?: number,
};

const PageBanner = ({ title, subtitle, bg, bottomComponent, height, titleLarge }: Props) => {
  const className = cx('pageBanner__subtitle', { 'mb-md': bottomComponent });
  const titleClassName = cx('pageBanner__title', { 'pageBanner__title--large': titleLarge });
  return (
    <div className="row column">
      <div
        className="pageBanner"
        style={{ minHeight: height || 180 }}
      >
        <div
          className="pageBanner__content"
          style={{
            backgroundImage: `url(${bg})`,
            minHeight: height,
          }}
        >
          <h1 className={titleClassName}>{title}</h1>
          <h5 className={className}>{subtitle}</h5>
          { bottomComponent }
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
