// @flow

import React, { Component } from 'react';
import { List } from 'immutable';

import SearchField from 'components/SearchField';
import Preloader from 'components/Preloader';
import CreateReviewCardList from 'components/CreateReview/CardList';
import Pagination from 'components/Pagination';

import './styles.scss';

type Props = {
  products: List<Map<string, Object>>,
  isLoading: boolean,
  pages: number,
  requestProducts: Function,
  trackPageStep2: Function,
}

class CreateReview extends Component {
  onInputChange = (value: string) => {
    this.props.requestProducts(['model', 'q'], value);
  }
  props: Props
  render() {
    const { products, isLoading, pages } = this.props;
    return (
      <div className="createReview">
        <div className="createReview__top">
          <div className="row column text-center mb-sm">
            <h3>Search for a strain or oil</h3>
          </div>
          <div className="row align-middle">
            <div className="column">
              <SearchField
                className="dark"
                onChange={this.onInputChange}
              />
            </div>
          </div>
        </div>
        <div>
          {
            isLoading ?
              <div className="text-center">
                <Preloader height={248} />
              </div> : <CreateReviewCardList
                products={products}
                trackPageStep2={this.props.trackPageStep2}
              />
          }
          <Pagination
            initialPage={1}
            pageCount={Math.ceil(pages)}
            onPageChange={(e) => this.props.requestProducts(['model', 'page'], e)}
          />
        </div>
      </div>
    );
  }
}

export default CreateReview;
