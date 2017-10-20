// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import ValidationMessage from 'components/ValidationMessage';
import Spinner from 'components/Spinner';
import BorderedTitle from 'components/BorderedTitle';

import { requestLogin, trackGoStep1 } from 'containers/App/sagas';

import CreateReviewBanner from 'images/banners/create-a-review.jpg';

const schema = yup.object({
  username: yup
    .string()
    .required(),
  password: yup
    .string()
    .required(),
});

type Props = {
  user: Object,
  requestLogin: Function,
  trackGoStep1: Function,
  isLoading: boolean,
  error: string,
};

class LoginPage extends Component {
  state = {
    model: {
      username: '',
      password: '',
    },
  }
  componentWillReceiveProps({ user }: Props) {
    if (!this.props.user && user) {
      browserHistory.push('/go');
      this.props.trackGoStep1();
    }
  }
  props: Props
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Go',
      },
    ]);
    return (
      <div>
        <Helmet title="Login" />
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={CreateReviewBanner}
          title="Write a review"
          subtitle="Start by signing up or logging in below"
        />
        <BorderedTitle
          element="h2"
          className="createReviewCardList__borderedTitle"
          centered
        >
          Log In
        </BorderedTitle>
        <Form
          schema={schema}
          value={this.state.model}
          onChange={(model) => this.setState({ model })}
          onSubmit={(e) => this.props.requestLogin(e)}
        >
          <div className="row column mb-hg">

            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <label htmlFor="username">Email / Username*</label>
                  <Field
                    className="accent"
                    name="username"
                    id="username"
                    type="text"
                  />
                  <ValidationMessage for="username" />
                </div>
                <div className="mb-lg">
                  <label htmlFor="password">Password*</label>
                  <Field
                    className="accent"
                    name="password"
                    id="password"
                    type="password"
                  />
                  <ValidationMessage for="password" />
                </div>
              </div>
            </div>
            <div className="text-center mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
              >{this.props.isLoading && <Spinner className="mr-sm" />}Log in now</Button>
            </div>
            <div className="text-center">
              <Link
                to="/go/register"
              >
                {'Don\'t have an account? Sign up here'}
              </Link>
            </div>
            <div className="text-center c-danger mt-md">{this.props.error}</div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = (dispatch) => ({
  requestLogin: (payload) => dispatch(requestLogin(payload)),
  trackGoStep1: () => dispatch(trackGoStep1()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
