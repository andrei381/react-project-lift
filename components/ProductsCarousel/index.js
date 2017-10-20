// @flow

import React from 'react';

import Carousel from 'components/Carousel';
import Preloader from 'components/Preloader';
import ProductCard from 'components/ProductCard';
import './styles.scss';

type Props = {
  data: Object,
  category: string,
  title?: string,
}

const carouselSettings = {
  responsive: [
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        dots: true,
        arrows: false,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        dots: true,
        arrows: false,
      },
    },
    {
      breakpoint: 9999,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
};

const FilterableProducts = ({ data, category, title }: Props) => {
  const items = data.get('items');
  return (
    <div className="row column">
      <div className="productsCarousel">
        <h2 className="productsCarousel__title">Shop {title || category}</h2>
        {data.get('isLoading') ?
          <div className="text-center"><Preloader height={423} /></div> :
          <div className="productsCarousel__carousel">
            <Carousel {...carouselSettings}>
              {items && items.map((item) => (
                <div
                  className="productsCarousel__item small-12 medium-6 large-3 column"
                  key={item.get('_id')}
                >
                  <ProductCard data={item} />
                </div>
              ))}
            </Carousel>
          </div>
      }
      </div>
    </div>
  );
};

export default FilterableProducts;
