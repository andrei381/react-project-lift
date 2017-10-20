// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import { generate } from 'shortid';

import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/Tab';
import BorderedTitle from 'components/BorderedTitle';
import Pagination from 'components/Pagination';
import CommentList from 'components/CommentList';
import Sort from 'components/Sort';
import Select from 'components/Select';

import {
  requestComments,
  submitComment,
  deleteComment,
  sortComment,
  setBreadcrumbPath,
} from 'containers/Product/sagas';

import { COMMENT_SORT_OPTIONS } from 'containers/constants';

type Props = {
  params: Object,
  setBreadcrumbPath: Function,
  requestComments: Function,
  submitComment: Function,
  deleteComment: Function,
  sortComment: Function,
  data: Object,
  isLoading: boolean,
  commentsData: Object,
  commentsPages: number,
  commentsLoading: boolean,
  comment: Object,
  commentsSortBy: string,
  currentUser: Object,
  slug: string,
};

class ProductCommentsPage extends Component {
  componentWillMount() {
    const { data } = this.props;
    if (data) {
      this.props.requestComments(data.get('_id'));
      this.setBreadcrumbPath(data);
    }
  }
  componentWillReceiveProps(newProps) {
    const { isLoading, data, comment, commentsLoading, commentsSortBy } = newProps;

    const productId = data ? data.get('_id') : null;
    const wasUpdatingComment = this.props.comment.get('isLoading');
    const isCommentUpdated = comment.get('isLoading') === false &&
      comment.get('error') === '';

    const wasLoadingProduct = this.props.isLoading;
    const isProductLoaded = isLoading === false &&
      !!data &&
      !!data.get('_id');

    if (!commentsLoading &&
      wasLoadingProduct &&
      isProductLoaded) {
      this.props.requestComments(data.get('_id'));
      this.setBreadcrumbPath(data);
    }

    if (commentsSortBy !== this.props.commentsSortBy) {
      this.props.requestComments(data.get('_id'));
    }

    if (data &&
      wasUpdatingComment === true &&
      isCommentUpdated === true) {
      this.props.requestComments(productId, ['page'], 1);
    }
  }
  setBreadcrumbPath = (data: Object) => {
    const { slug } = this.props;
    const category = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const breadcrumbPath = fromJS([
      {
        link: '/shop',
        title: 'Shop',
      },
      {
        link: `/${category}s`,
        title: `${category}s`,
      },
      {
        link: `/${category}s/${slug}`,
        title: (data ? data.get('name') : ''),
      },
      {
        link: '',
        title: 'Comments',
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  }
  props: Props
  render() {
    const {
      data,
      currentUser,
      commentsData,
      commentsPages,
      commentsLoading,
      commentsSortBy,
    } = this.props;
    const productId = data ? data.get('_id') : null;
    let commentsCount = 0;
    if (commentsData) {
      commentsCount = commentsData.size;
    }
    const category = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const baseUrl = `/${category}s/${this.props.params.slug}`;
    return (
      <div className="mb-xl">
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={`${baseUrl}/about`}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          <Tab to={`${baseUrl}/comments`}>Comments</Tab>
        </ButtonGroup>
        <Select
          className="mb-lg show-for-small-only b-primary"
          value={'Comments'}
          onChange={(e) => browserHistory.push(`${baseUrl}/${e.target.value.toLowerCase()}`)}
        >
          {['About', 'Reviews', 'Comments'].map((item) => (
            <option
              key={generate()}
              value={item}
            >{item}</option>
          ))}
        </Select>
        <BorderedTitle>{commentsCount} comments</BorderedTitle>
        <Sort
          options={COMMENT_SORT_OPTIONS}
          value={commentsSortBy}
          sort={this.props.sortComment}
        />
        <section>
          <CommentList
            data={commentsData}
            isLoading={commentsLoading}
            currentUser={currentUser}
            requestComment={this.props.submitComment}
            deleteComment={this.props.deleteComment}
            comment={fromJS({})}
          />
        </section>
        <Pagination
          initialPage={1}
          pageCount={commentsPages + 1}
          onPageChange={(e) => this.props.requestComments(productId, ['page'], e)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  data: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  slug: state.getIn(['product', 'slug']),
  id: state.getIn(['product', 'id']),
  commentsData: state.getIn(['product', 'comments', 'data', 'hits']),
  commentsPages: state.getIn(['product', 'comments', 'data', 'pages']),
  commentsLoading: state.getIn(['product', 'comments', 'isLoading']),
  commentsSortBy: state.getIn(['product', 'comments', 'model', 'sortBy']),
  comment: state.getIn(['product', 'comment']),
});

const mapDispatchToProps = (dispatch) => ({
  requestComments: (id, path, value) => dispatch(requestComments(id, path, value)),
  submitComment: (payload, commentId) => dispatch(submitComment(payload, commentId)),
  deleteComment: (commentId) => dispatch(deleteComment(commentId)),
  sortComment: (sortBy) => dispatch(sortComment(sortBy)),
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCommentsPage);
