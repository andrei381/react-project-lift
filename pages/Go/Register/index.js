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
import CheckBox from 'components/Checkbox';
import Modal from 'components/Modal';

import { requestRegister, trackGoStep1 } from 'containers/App/sagas';
import CreateReviewBanner from 'images/banners/create-a-review.jpg';
import terms from './../../TermsAndConditions/terms';

const schema = yup.object({
  username: yup
    .string()
    .min(3, 'minimum username length is 3 characters')
    .max(18, 'max password length is 18 characters')
    .required(),
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
  trackGoStep1: Function,
  isLoading: boolean,
  error: string,
  user: Object,
};

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
      browserHistory.push('/go');
    }
  }
  componentWillReceiveProps({ user }: Props) {
    if (!this.props.user && user) {
      browserHistory.push('/go');
      this.props.trackGoStep1();
    }
  }
  props: Props
  render() {
    const { isLoading, error, user } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Go',
      },
    ]);
    return (
      <div>
        <Helmet title="Register" />
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
          Sign Up
        </BorderedTitle>
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
                  <div className="fs-mn">A unique name between 3 and 18 characters</div>
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
                onChange={() => { this.state.model.terms = true; }}
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
            <div className="text-center">
              <Link
                to="/go/login"
              >
                Already have an account? Login here
              </Link>

            </div>
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
  trackGoStep1: () => dispatch(trackGoStep1()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
