// @flow

import React from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { Link } from 'react-router';
import { fromJS } from 'immutable';

import Icon from 'components/Icon';
import DoctorIcon from 'images/sprite/doctor.svg';
import ProducerIcon from 'images/sprite/producer.svg';
import ReviewIcon from 'images/sprite/review.svg';
import StrainIcon from 'images/sprite/strain.svg';

import './styles.scss';

type Props = {
  data?: Array<Object>,
  className?: string,
};

const defaultFeatureList = fromJS([
  {
    icon: DoctorIcon,
    content: 'Find a doctor',
    linkTo: 'doctors',
  },
  {
    icon: ProducerIcon,
    content: 'find a producer',
    linkTo: 'producers',
  },
  {
    icon: StrainIcon,
    content: 'find a strain',
    linkTo: 'strains',
  },
  {
    icon: ReviewIcon,
    content: 'Leave reviews & collect Lift Points',
    linkTo: 'rewards',
  },
]);

const FeatureList = ({ data = defaultFeatureList, className }: Props) => {
  const mergedClassName = cx('featureList row align-spaced', className);
  return (
    <div className={mergedClassName}>
      {data.map((item) => (
        <Link
          className="featureList__item column mb-md"
          to={item.get('linkTo', '')}
          key={generate()}
        >
          <Icon
            glyph={item.get('icon', '')}
            width={80}
            height={80}
            className="mb-mx"
          />
          <div className="featureList__content">{item.get('content', '')}</div>
        </Link>
      ))}
    </div>
  );
};

export default FeatureList;
