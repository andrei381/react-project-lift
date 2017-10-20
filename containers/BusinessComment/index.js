// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import { generate } from 'shortid';

import CommentList from 'components/CommentList';
import CommentBox from 'components/CommentBox';
import Pagination from 'components/Pagination';
import Sort from 'components/Sort';
import BorderedTitle from 'components/BorderedTitle';
import Tab from 'components/Tab';
import ButtonGroup from 'components/ButtonGroup';
import Select from 'components/Select';

import {
  requestBusinessProfile,
  requestBusinessComments,
  requestComment,
  deleteComment,
  sortComment,
  setBreadcrumbPath,
} from 'containers/BusinessProfile/sagas';

import { COMMENT_SORT_OPTIONS } from 'containers/constants';

type Props = {
  category: string,
  isLoading: boolean,
  isLoadingComments: boolean,
  business: Object,
  comments: Map<string, Object>,
  commentPages: number,
  commentsSortBy: string,
  comment: Object,
  slug: string,
  requestBusinessComments: Function,
  requestComment: Function,
  deleteComment: Function,
  sortComment: Function,
  currentUser: Object,
  setBreadcrumbPath: Function,
};

class BusinessCommentContainer extends Component {
  componentWillMount() {
    const { business } = this.props;
    if (business && business.get('id')) {
      this.props.requestBusinessComments(business.get('id'));
      this.setBreadcrumbPath(business);
    }
  }

  componentWillReceiveProps(newProps) {
    const { business, comment, commentsSortBy } = this.props;
    const wasUpdatingComment = comment.get('isLoading');
    const isCommentUpdated = newProps.comment.get('isLoading') === false &&
      newProps.comment.get('error') === '';

    const wasLoadingProfile = this.props.isLoading;
    const isProfileLoaded = newProps.isLoading === false &&
      !!newProps.business &&
      !!newProps.business.get('id');

    if (newProps.isLoadingComments === false &&
      wasLoadingProfile &&
      isProfileLoaded) {
      this.props.requestBusinessComments(newProps.business.get('id'));
    }

    if (business &&
      wasUpdatingComment === true &&
      isCommentUpdated === true) {
      this.props.requestBusinessComments(business.get('id'));
    }

    if (newProps.commentsSortBy !== commentsSortBy) {
      this.props.requestBusinessComments(business.get('id'));
    }
  }

  setBreadcrumbPath = (data: Object) => {
    const { slug, category } = this.props;
    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const breadcrumbPath = fromJS([
      {
        link: '/find',
        title: 'Find',
      },
      {
        link: `/${categoryPlural}`,
        title: categoryPlural,
      },
      {
        link: `/${categoryPlural}/${slug}`,
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
      category,
      business,
      comments,
      commentPages,
      commentsSortBy,
      comment,
      isLoadingComments,
      slug,
      currentUser,
    } = this.props;

    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const businessId = business.get('id');
    const baseUrl = `/${categoryPlural}/${slug}`;
    let commentsCount = 0;
    if (comments) {
      commentsCount = comments.size;
    }

    return (
      <div>
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={`${baseUrl}/about`}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          <Tab to={`${baseUrl}/comments`}>Comments</Tab>
          <Tab to={`${baseUrl}/products`}>Products</Tab>
        </ButtonGroup>
        <div className="row">
          <div className="column">
            <Select
              className="mb-lg show-for-small-only b-primary"
              value={'Comments'}
              onChange={(e) => {
                if (e.target.value === 'About') {
                  browserHistory.push(baseUrl);
                } else {
                  browserHistory.push(`${baseUrl}/${e.target.value.toLowerCase()}`);
                }
              }}
            >
              {['About', 'Reviews', 'Comments', 'Products'].map((item) => (
                <option
                  key={generate()}
                  value={item}
                >{item}</option>
              ))}
            </Select>
          </div>
        </div>
        <BorderedTitle>{commentsCount} comments</BorderedTitle>
        <Sort
          options={COMMENT_SORT_OPTIONS}
          value={commentsSortBy}
          sort={this.props.sortComment}
        />
        <CommentList
          data={comments}
          isLoading={isLoadingComments}
          currentUser={currentUser}
          requestComment={this.props.requestComment}
          deleteComment={this.props.deleteComment}
          comment={comment}
        />
        <CommentBox
          data={business}
          comment={comment}
          requestComment={this.props.requestComment}
          currentUser={currentUser}
        />

        <Pagination
          initialPage={1}
          pageCount={commentPages}
          onPageChange={(e) => this.props.requestBusinessComments(businessId, ['page'], e)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.getIn(['app', 'user']),
  business: state.getIn(['profile', 'business', 'data']),
  isLoading: state.getIn(['profile', 'business', 'isLoading']),
  error: state.getIn(['profile', 'business', 'error']),
  comments: state.getIn(['profile', 'comments', 'data', 'hits']),
  commentPages: state.getIn(['profile', 'comments', 'data', 'pages']),
  commentsSortBy: state.getIn(['profile', 'comments', 'model', 'sortBy']),
  comment: state.getIn(['profile', 'comment']),
  isLoadingComments: state.getIn(['profile', 'comments', 'isLoading']),
});

const mapDispatchToProps = (dispatch) => ({
  requestBusinessProfile: (slug, value) => dispatch(requestBusinessProfile(slug, value)),
  requestBusinessComments: (category, id, value) => dispatch(requestBusinessComments(category, id, value)),
  requestComment: (payload, commentId) => dispatch(requestComment(payload, commentId)),
  deleteComment: (commentId) => dispatch(deleteComment(commentId)),
  sortComment: (sortBy) => dispatch(sortComment(sortBy)),
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessCommentContainer);
