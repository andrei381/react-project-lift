// @flow

import React from 'react';
import { Link } from 'react-router';

import Carousel from 'components/Carousel';
import Preloader from 'components/Preloader';
import ButtonGroup, { ButtonGroupItem } from 'components/ButtonGroup';
import ProductCard from 'components/ProductCard';
import Select from 'components/Select';
import './styles.scss';

type Props = {
  data: Object,
  category: string,
  requestItems: Function,
  linksTo: string,
}

const carouselSettings = {
  responsive: [
    {
      breakpoint: 640,
      settings: {
        dots: true,
        arrows: false,
      },
    },
    {
      breakpoint: 9999,
      settings: 'unslick',
    },
  ],
};

const FilterableProducts = ({ data, category, requestItems, linksTo }: Props) => {
  const items = data.getIn(['filters', data.get('active'), 'items']);
  const filters = data.get('filters');
  return (
    <div className="row column">
      <div className="filterableProducts">
        <div className="row align-bottom mb-xl">
          <div className="small-12 medium-4 column mb-mn">
            <h2 className="filterableProducts__title">{category}</h2>
          </div>
          <div className="small-12 medium-4 column mb-mn">
            <div className="hide-for-small-only">
              <ButtonGroup className="filterableProducts__buttonGroup">
                {filters.map((item) => {
                  const index = item.get('index');
                  return (
                    <ButtonGroupItem
                      active={item.get('index') === data.get('active')}
                      key={index}
                      onClick={() => requestItems(index, category)}
                      className="filterableProducts__buttonGroupItem"
                    >{item.get('name')}</ButtonGroupItem>
                  );
                })}
              </ButtonGroup>
            </div>
            <div className="show-for-small-only">
              <Select
                className="b-primary"
                value={data.get('active')}
                onChange={(e) => requestItems(e.target.value, category)}
              >
                {filters.map((item) => {
                  const index = item.get('index');
                  return (
                    <option
                      key={index}
                      value={index}
                    >{item.get('name')}</option>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="small-12 medium-4 column mb-mn text-right">
            <Link
              className="fs-md"
              to={linksTo}
            >
              See all
            </Link>
          </div>
        </div>
        {data.get('isLoading') ?
          <div className="text-center"><Preloader height={423} /></div> :
          <div className="filterableProducts__carousel">
            <Carousel {...carouselSettings}>
              {items && items.map((item) => (
                <div
                  className="filterableProducts__item small-12 medium-6 large-3 column"
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
