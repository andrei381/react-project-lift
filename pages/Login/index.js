// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { goBack } from 'react-router-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import ValidationMessage from 'components/ValidationMessage';
import Spinner from 'components/Spinner';

import { requestLogin } from 'containers/App/sagas';

import AuthBanner from 'images/banners/auth.jpg';

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
  isLoading: boolean,
  error: string,
  goBack: Function,
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
      this.props.goBack();
    }
  }
  props: Props
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Login',
      },
    ]);
    return (
      <div>
        <Helmet title="Login" />
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={AuthBanner}
          title="Login"
          titleLarge
          subtitle="Welcome back"
        />
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
              >{this.props.isLoading && <Spinner className="mr-sm" />}sign in</Button>
            </div>
            <div className="text-center">
              <Link
                to="/reset-password"
              >
                Forgot password?
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
  goBack: () => dispatch(goBack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
