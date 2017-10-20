// @flow

import React from 'react';
import { List } from 'immutable';

import ProductCard from 'components/ProductCard';
import './styles.scss';

type Props = {
  data: List<Map<string, Object>>,
}

const ProductsList = ({ data }: Props) => (
  <div className="productsList row align-stretch">
    {data && data.entrySeq().map(([key, value]) => ( // see https://github.com/facebook/immutable-js/issues/667 for detailed description
      <div
        className="productsList__item small-12 medium-6 large-3 column"
        key={key}
      >
        <ProductCard data={value} />
      </div>
    ))}
  </div>
);

export default ProductsList;
