// @flow

import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';

import Icon from 'components/Icon';

import ChevronLeft from 'images/sprite/chevron-left.svg';
import ChevronRight from 'images/sprite/chevron-right.svg';
import './styles.scss';

type Props = {
  initialPage: number,
  pageCount: number,
  pageRangeDisplayed?: number,
  marginPagesDisplayed?: number,
  onPageChange: Function,
}

class Pagination extends Component {
  constructor(props: Object) {
    super();
    this.state = {
      currentPage: props.initialPage,
    };
  }
  state: {
    currentPage: number,
  };
  props: Props
  render() {
    const {
      initialPage,
      pageCount,
      pageRangeDisplayed = 1,
      marginPagesDisplayed = 2,
      onPageChange,
    } = this.props;
    if (!pageCount || pageCount < 2) {
      return null;
    }
    return (
      <div className="row align-middle mb-xl">
        <div className="column fs-mn c-darkest-primary">
          Showing page {this.state.currentPage} of {this.props.pageCount}
        </div>
        <div className="shrink column">
          <ReactPaginate
            initialPage={initialPage - 1}
            pageCount={pageCount}
            pageRangeDisplayed={pageRangeDisplayed}
            marginPagesDisplayed={marginPagesDisplayed}
            containerClassName="pagination"
            previousClassName="pagination-previous"
            nextClassName="pagination-next"
            activeClassName="current"
            previousLabel={
              <Icon
                glyph={ChevronLeft}
                size={10}
              />
            }
            nextLabel={
              <Icon
                glyph={ChevronRight}
                size={10}
              />
            }
            onPageChange={(e) => {
              this.setState({ currentPage: e.selected + 1 });
              onPageChange(e.selected + 1);
            }}
            disableInitialCallback
          />
        </div>
      </div>
    );
  }
}

export default Pagination;
