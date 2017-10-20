// @flow

import React from 'react';
import Helmet from 'react-helmet';

import MetaJson from 'containers/MetaJson';

type Props = {
  title: string,
  children?: React.Element<any>,
};
const HelmetComponent = ({ title, children, ...otherProps }: Props) => {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: title,
  };
  return (
    <div>
      <Helmet
        title={title}
        {...otherProps}
      >
        {children}
      </Helmet>
      <MetaJson data={data} />
    </div>
  );
};


export default HelmetComponent;
