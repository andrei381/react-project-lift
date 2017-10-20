// @flow

import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

import Tooltip from 'components/Tooltip';
import Button from 'components/Button';
import ReviewCount from 'components/ReviewCount';
import ProductPrice from 'components/ProductPrice';
import ProductCategory from 'components/ProductCategory';
import Cannabinoids from 'components/Cannabinoids';

import './styles.scss';

type Props = {
  data: Object,
}

const ProductCard = (props: Props) => {
  const { data } = props;
  const category = data.get('category');
  const availabilityStatus = data.getIn(['variants', 0, 'availabilityStatus']);
  const producer = data.getIn(['producer', 'name']);
  const className = cx(
    'productCard__availabilityStatus',
    `productCard__availabilityStatus--${availabilityStatus.replace(/\s+/g, '-')}`
  );
  const baseUrl = `/${data.get('__t') && data.get('__t') ? data.get('__t').toLowerCase() : 'product'}s`;
  return (
    <div className="productCard">
      <div className="row align-middle mb-md">
        <div className="shrink column npr">
          <ProductCategory data={category} />
        </div>
        {
          category && <div className="shrink column">
            <Tooltip
              tooltipPosition="top"
              tooltipIndicator={false}
              tooltipContent={availabilityStatus}
            ><div
              className={className}
            /></Tooltip>
          </div>
        }
      </div>
      <Link
        className="productCard__link"
        to={`${baseUrl}/${data.get('slug')}`}
      >
        <div
          className="productCard__image"
          style={{ backgroundImage: `url('https://images.lift.co/resize/125x125/${data.get('thumbnail')}')` }}
        />
        <h4 className="mb-sm">{data.get('name')}</h4>
      </Link>
      {producer && <div className="productCard__producer">{producer}</div>}
      <Cannabinoids
        thc={data.get('thc')}
        cbd={data.get('cbd')}
      />
      <ReviewCount
        className=" align-center mb-md"
        reviewCount={data.get('reviews').size}
        ratingsAverage={data.get('rating')}
        to={`${baseUrl}/${data.get('slug')}/reviews`}
      />
      <div className="mb-md">
        <ProductPrice
          price={data.getIn(['variants', '0', 'price'])}
          unit={data.getIn(['variants', '0', 'doseUnit'])}
          doseAmount={data.getIn(['variants', '0', 'doseAmount'])}
        />
      </div>
      <div className="row">
        <div className="column text-center">
          <Button
            element={Link}
            to={`${baseUrl}/${data.get('slug')}`}
            className="large secondary"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
