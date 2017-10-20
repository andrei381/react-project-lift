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

import { requestChange } from './sagas';

const schema = yup.object({
  password: yup
    .string()
    .min(6, 'minimum password length is 6 characters')
    .required(),
  confirmPassword: yup
    .mixed()
    .test('match', 'Passwords do not match', function comparePasswords(confirmPassword) {
      return confirmPassword === this.parent.password;
    })
    .required(),
});

type Props = {
  requestChange: Function,
  location: Object,
  isLoading: boolean,
  success: string,
  error: string,
};

class ChangePassword extends Component {
  state = {
    model: {
      password: '',
      confirmPassword: '',
    },
  }
  props: Props
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Change Password',
      },
    ]);
    return (
      <div>
        <Helmet title="Change Password" />
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={AuthBanner}
          title="Change Password"
          titleLarge
          subtitle="Enter a new password below."
        />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={(model) => this.setState({ model })}
          onSubmit={(e) => this.props.requestChange(e, this.props.location.query.token)}
        >
          <div className="row column mb-hg">
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <label htmlFor="password">Password*</label>
                  <Field
                    className="accent"
                    name="password"
                    id="password"
                    type="text"
                  />
                  <ValidationMessage for="password" />
                </div>
                <div className="mb-lg">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <Field
                    className="accent"
                    name="confirmPassword"
                    id="confirmPassword"
                    type="text"
                  />
                  <ValidationMessage for="confirmPassword" />
                </div>
              </div>
            </div>
            <div className="text-center mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
              >{this.props.isLoading && <Spinner className="mr-sm" />}Change Password</Button>
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
  isLoading: state.getIn(['changePassword', 'isLoading']),
  error: state.getIn(['changePassword', 'error']),
  success: state.getIn(['changePassword', 'success']),
});

const mapDispatchToProps = (dispatch) => ({
  requestChange: (payload) => dispatch(requestChange(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
