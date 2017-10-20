// @flow

import React from 'react';
import numeral from 'numeral';

type Props = {
  price?: number,
  unit?: string,
  doseAmount?: string,
};

const ProductPrice = ({ price, unit, doseAmount }: Props) => {
  const dosage = (doseAmount === 1) ? '' : String(doseAmount);
  const unitLabel = unit ? `(${dosage}${unit})` : '';
  return (
    <span>
      <strong>Price&nbsp;</strong>
      {price ?
        <span>${numeral(price / 100).format('0.00')} <span className="t-lowercase">{unitLabel}</span></span> :
        'unknown'
      }
    </span>
  );
};

export default ProductPrice;
