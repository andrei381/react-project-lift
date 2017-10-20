// @flow

import React from 'react';
import moment from 'moment';

import Icon from 'components/Icon';

import ClockIncon from 'images/sprite/clock.svg';
import './styles.scss';

type Props = {
  data?: string,
  title?: string,
  prefix?: string,
};

const TimeAgo = ({ data, title, prefix }: Props) => {
  const fromNow = moment(data).fromNow();
  return (
    <div
      className="timeAgo f-secondary"
      title={title}
    >
      <Icon
        className="mr-tn"
        glyph={ClockIncon}
        width={13}
        height={13}
      />
      {`${String(prefix)} ${fromNow}`}
    </div>
  );
};

TimeAgo.defaultProps = {
  prefix: '',
};

export default TimeAgo;
