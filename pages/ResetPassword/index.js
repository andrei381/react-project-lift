// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import ValidationMessage from 'components/ValidationMessage';
import Spinner from 'components/Spinner';

import AuthBanner from 'images/banners/auth.jpg';

import { requestReset } from './sagas';

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
});

type Props = {
  requestReset: Function,
  isLoading: boolean,
  success: string,
  error: string,
}

class ResetPassword extends Component {
  state = {
    model: {
      email: '',
    },
  }
  props: Props
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Reset Password',
      },
    ]);
    return (
      <div>
        <Helmet title="Reset Password" />
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={AuthBanner}
          title="Reset Password"
          titleLarge
          subtitle="Enter your email and we'll send you a reset password confirmation."
        />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={(model) => this.setState({ model })}
          onSubmit={(e) => this.props.requestReset(e)}
        >
          <div className="row column mb-hg">
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <label htmlFor="email">Email*</label>
                  <Field
                    className="accent"
                    name="email"
                    id="email"
                    type="text"
                  />
                  <ValidationMessage for="email" />
                </div>
              </div>
            </div>
            <div className="text-center mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
              >{this.props.isLoading && <Spinner className="mr-sm" />}Reset Password</Button>
            </div>
            <div className="text-center c-primary mt-md">{this.props.success}</div>
            <div className="text-center c-danger mt-md">{this.props.error}</div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['resetPassword', 'isLoading']),
  error: state.getIn(['resetPassword', 'error']),
  success: state.getIn(['resetPassword', 'success']),
});

const mapDispatchToProps = (dispatch) => ({
  requestReset: (payload) => dispatch(requestReset(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
