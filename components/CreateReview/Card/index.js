// @flow

import React from 'react';
import { Link } from 'react-router';

import './styles.scss';

type Props = {
  product: Object,
  trackPageStep2: Function,
}
const CreateReviewCard = ({ product, trackPageStep2 }: Props) => {
  const categoryPlural = product.get('__t') ? `${product.get('__t').toLowerCase()}s` : 'products';
  const slug = product.get('slug');
  return (
    <Link
      className="createReviewCard row align-middle"
      to={`/${categoryPlural}/${slug}/create-review`}
      onClick={() => trackPageStep2(product.getIn(['business', 'name']), product.get('name'))}
    >
      <div className="small-12 medium-12 column">
        <div className="createReviewCard__productName">{product.get('name')}</div>
        <div className="createReviewCard__producerName">{product.getIn(['business', 'name'])}</div>
      </div>
    </Link>
  );
};

export default CreateReviewCard;
