// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import type { Map } from 'immutable';

import Button from 'components/Button';
import CommentModal from 'components/CommentModal';

import './styles.scss';

type Props = {
  data: Map<string, string>,
  requestComment: Function,
  comment: Object,
  currentUser: Object,
};

class CommentBox extends Component {

  props: Props
  render() {
    const { data, requestComment, comment, currentUser } = this.props;
    const isLoadingComment = comment.get('isLoading');
    const commentError = comment.get('error');
    const topic = {
      name: data.get('name'),
      ref: data.get('id'),
    };
    const url = window.location.href;
    return (
      <div className="commentBox row mb-lg">
        <div className="column">
          <div className="commentBox__section">
            <div className="row align-bottom">
              <div className="column small-7 fs-mx">
                <h2>Write a comment</h2>
                { !currentUser &&
                  <div>
                    <div>
                      You must be signed in to add comments.
                    </div>
                    <div>
                      {'Don\'t have an account?'}&nbsp;
                      <Link
                        to={'/register'}
                        className="t-nt fs-mx c-secondary"
                      >Create one</Link>
                    </div>
                  </div>
                }
              </div>
              <div className="column small-5">
                { currentUser ?
                  <CommentModal
                    topic={topic}
                    url={url}
                    requestComment={requestComment}
                    isLoading={isLoadingComment}
                    error={commentError}
                    textIsButton
                    linkStyle="large"
                  />
                  : <Link
                    to={'/login'}
                    className="commentBox__actionLink"
                  >
                    <Button
                      element="button"
                      className="large secondary mr-md"
                    >Sign In</Button>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentBox;
