// @flow

import React from 'react';

import ProductReviewContainer from 'containers/ProductReview';

type Props = {
  params: Object,
};

const ProductReviewEditPage = ({ params }: Props) => (
  <ProductReviewContainer
    category="edit"
    params={params}
  />
);

export default ProductReviewEditPage;
