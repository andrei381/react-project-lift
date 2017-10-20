// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { replace } from 'react-router-redux';

import Breadcrumbs from 'components/Breadcrumbs';
import CheckBox from 'components/Checkbox';
import PageBanner from 'components/PageBanner';
import ValidationMessage from 'components/ValidationMessage';
import Spinner from 'components/Spinner';
import Modal from 'components/Modal';
import { requestRegister } from 'containers/App/sagas';

import AuthBanner from 'images/banners/auth.jpg';
import terms from 'pages/TermsAndConditions/terms';
import { USERNAME_SCHEMA, USERNAME_MIN_CHAR, USERNAME_MAX_CHAR } from 'containers/constants';

const schema = yup.object({
  username: USERNAME_SCHEMA,
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(6, 'minimum password length is 6 characters')
    .required(),
  terms: yup
    .boolean()
    .required('Must Accept Terms and Conditions'),
});

type Props = {
  requestRegister: Function,
  isLoading: boolean,
  error: string,
  user: Object,
  replace: Function,
}

class RegisterPage extends Component {
  state = {
    model: {
      username: '',
      email: '',
      password: '',
    },
  }
  componentWillMount() {
    if (this.props.user) {
      this.props.replace('/me');
    }
  }
  componentWillReceiveProps({ user }: Props) {
    if (!this.props.user && user) {
      this.props.replace('/me');
    }
  }
  props: Props
  render() {
    const { isLoading, error, user } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Register',
      },
    ]);
    return (
      <div>
        <Helmet title="Register" />
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={AuthBanner}
          title="Registration"
          titleLarge
          subtitle="Join Canada’s largest online cannabis community"
        />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={(model) => this.setState({ model })}
          onSubmit={(e) => this.props.requestRegister(e)}
        >
          <div className="row column mb-hg">
            <div className="row centered">
              <div className="small-12 medium-8 medium-offset-2 column center">
                <div className="mb-lg">
                  <label htmlFor="email">Email address*</label>
                  <Field
                    className="accent"
                    name="email"
                    id="email"
                    type="email"
                  />
                  <div className="fs-mn">We’ll never share your email publicly</div>
                  <ValidationMessage for="email" />
                </div>
                <div className="mb-lg">
                  <label htmlFor="username">Username*</label>
                  <Field
                    className="accent"
                    name="username"
                    id="username"
                    type="text"
                  />
                  <div className="fs-mn">A unique name between {USERNAME_MIN_CHAR} and {USERNAME_MAX_CHAR} characters</div>
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
                  <div className="fs-mn">At least 6 characters</div>
                  <ValidationMessage for="password" />
                </div>
              </div>
            </div>
            <div className="text-center mb-md">
              <Modal
                promptText="You have read and agreed to the"
                linkText="Terms and Conditions"
                textIsButton={false}
                content={terms.liftRewardsToS}
                title={'Lift Terms and Conditions'}
                isOpen={false}
              />
              <CheckBox
                id="terms"
                name="terms"
                onChange={() => {
                  this.setState({
                    model: {
                      ...this.state.model,
                      terms: true,
                    },
                  });
                }}
              />
              <ValidationMessage for="terms" />
            </div>
            <div className="text-center">
              <Button
                className="button secondary spacious"
                type="submit"
              >{isLoading && <Spinner className="mr-sm" />}register now</Button>
            </div>
            <div className="text-center c-danger mt-md">{error}</div>
            {user &&
              <div className="text-center mt-xl">
                <div className="mb-md">You have successfully registered.</div>
              </div>
            }
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['app', 'isLoading']),
  user: state.getIn(['app', 'user']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = (dispatch) => ({
  requestRegister: (payload) => dispatch(requestRegister(payload)),
  replace: (path) => dispatch(replace(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
