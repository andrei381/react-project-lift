// @flow

import React from 'react';

import ProductReviewContainer from 'containers/ProductReview';

type Props = {
  params: Object,
};

const ProductReviewViewPage = ({ params }: Props) => (
  <ProductReviewContainer
    category="view"
    params={params}
  />
);

export default ProductReviewViewPage;
