// @flow
import React from 'react';
import Icon from 'components/Icon';

type Props = {
  title: string,
  children?: React.Element<any>,
  icon: string,
  className?: string,
};
const ImageLabel = ({ icon, title, className, children }: Props) => (
  <div className={className}>
    <div className="mb-sm fs-mx">
      {title}
    </div>
    <div className="row">
      <div className="column shrink ">
        <Icon
          glyph={icon}
          size={60}
          className="mb-sm"
        />
        <div className="mb-sm fs-md text-center">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default ImageLabel;
