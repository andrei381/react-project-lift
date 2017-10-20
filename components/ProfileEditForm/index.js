// @flow
import React, { Component } from 'react';

import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import moment from 'moment';
import { generate } from 'shortid';
import { without } from 'lodash';
import { Link } from 'react-router';

import CustomSelect from 'components/CustomSelect';
import ValidationMessage from 'components/ValidationMessage';
import UserRoleBadge from 'components/UserRoleBadge';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';
import ConditionTag from 'components/ConditionTag';
import DateInput from 'components/DateInput';
import Checkbox from 'components/Checkbox';
import QuestionBadge from 'components/Advice/Question/Badge';
import DatePicker from 'components/DatePicker';

import { FILTER_PROVINCE_OPTIONS, CANNABIS_USAGE_PERIOD_OPTIONS, USERNAME_SCHEMA } from 'containers/constants';
import { convertCannabisYearToDate, convertDateToCannabisYear } from 'utils/convertCannabisYear';

import IconPlus from 'images/sprite/plus-white.svg';
import './styles.scss';

const schema = yup.object({
  firstName: yup
    .string(),
  lastName: yup
    .string(),
  username: USERNAME_SCHEMA,
  email: yup
    .string(),
  birthday: yup.date()
    .max(new Date(), "You can't be born in the future!"),
  province: yup
    .string(),
  city: yup
    .string(),
  bio: yup
    .string(),
  picture: yup
    .string(),
  usingCannabisSince: yup
    .string(),
});

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  saveUserData: Function,
  uploadPhoto: Function,
  uploadedPhoto: string,
}

type State = {
  model: Object,
  knownConditions: Array<string>,
  condition: string,
  isAnonymous: boolean,
}

class ProfileEditForm extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        firstName: props.user.get('firstName'),
        lastName: props.user.get('lastName'),
        username: props.user.get('username'),
        email: props.user.get('email'),
        birthday: moment(this.props.user.get('birthday')).toDate(),
        province: props.user.get('province'),
        city: props.user.get('city'),
        bio: props.user.get('bio'),
        picture: props.user.get('picture'),
        usingCannabisSince: props.user.get('usingCannabisSince') || '',
      },
      knownConditions: props.user.get('knownConditions') ? props.user.get('knownConditions').toJS() : [],
      condition: '',
      isAnonymous: props.user.get('isAnonymous'),
    };
  }
  state: State
  componentWillReceiveProps({ uploadedPhoto }: Props) {
    if (uploadedPhoto) {
      this.setState({
        model: {
          ...this.state.model,
          picture: uploadedPhoto,
        },
      });
    }
  }
  props: Props
  fileInput: HTMLElement
  handleFileUpload = (e: Event) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      const file = target.files[0];
      this.props.uploadPhoto(file);
    }
  }
  clickFileInput = () => {
    this.fileInput.click();
  }
  addCondition = () => {
    if (this.state.condition) {
      this.setState({
        knownConditions: [
          ...this.state.knownConditions,
          this.state.condition,
        ],
        condition: '',
      });
    }
  }
  removeCondition = (condition: string) => {
    const conditions = this.state.knownConditions;
    this.setState({
      knownConditions: without(conditions, condition),
    });
  }
  handleKeyPress = (e: Event) => {
    if (e.which === 13) {
      e.preventDefault();
      this.addCondition();
    }
  }
  render() {
    const { user, isLoading, error } = this.props;
    const questionBadgeContent = 'Your name may be shared with registered producers and doctors only after you directly contact them.';
    console.log(this.state.model.birthday);
    return (
      <Form
        className="profileEditForm"
        schema={schema}
        value={this.state.model}
        onChange={(model) => this.setState({ model })}
        onSubmit={(e) => {
          const postData = e;
          postData.knownConditions = this.state.knownConditions;
          postData.isAnonymous = this.state.isAnonymous;
          this.props.saveUserData(postData);
        }}
      >
        <div className="row">
          <div className="small-12 large-shrink column mr-md text-center">
            <div className="profileEditForm__photoUploader">
              <div
                className="profileEditForm__avatar"
                style={{ backgroundImage: `url(${this.state.model.picture}` }}
                title="User picture"
              />
              <Field
                className="profileEditForm__hiddenInput accent"
                name="picture"
                id="picture"
              />
              <ValidationMessage for="picture" />
              <div className="profileEditForm__uploadButtonBox">
                <input
                  className="profileEditForm__hiddenInput"
                  type="file"
                  onChange={this.handleFileUpload}
                  ref={(input) => { this.fileInput = input; }}
                />
                <Button
                  className="button profileEditForm__uploadButton"
                  type="button"
                  onClick={this.clickFileInput}
                >Upload New Picture</Button>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="row mb-md">
              <div className="shrink column">
                <UserRoleBadge role={user && user.get('role')} />
              </div>
            </div>
            <div className="row column mb-xl">
              <div className="row align-center mb-xl">
                <div className="small-12 medium-6 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="firstName"
                  >First Name</label>
                  <Field
                    className="accent"
                    name="firstName"
                    id="firstName"
                    type="text"
                  />
                  <ValidationMessage for="firstName" />
                </div>
                <div className="small-12 medium-6 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="lastName"
                  >Last Name</label>
                  <Field
                    className="accent"
                    name="lastName"
                    id="lastName"
                    type="text"
                  />
                  <ValidationMessage for="lastName" />
                </div>
              </div>
              <div className="row align-center mb-xl">
                <div className="small-12 medium-6 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="username"
                  >Username</label>
                  <Field
                    className="accent"
                    name="username"
                    id="username"
                    type="text"
                  />
                  <ValidationMessage for="username" />
                </div>
                <div className="small-12 medium-6 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="email"
                  >E-mail</label>
                  <Field
                    className="accent"
                    name="email"
                    id="email"
                    type="text"
                  />
                  <ValidationMessage for="email" />
                </div>
              </div>
              <div className="row mb-xl">
                <div className="small-12 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="birthday"
                  >Birthday</label>
                  <DateInput
                    className="profileEditForm__dateInput accent"
                    name="birthday"
                    id="birthday"
                    format="MM/DD/YYYY"
                  />
                  <DatePicker birthday={this.state.model.birthday} />
                  <ValidationMessage for="birthday" />
                </div>
              </div>
              <div className="row mb-xl">
                <div className="small-12 medium-12 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="usingCannabisSince"
                  >How many years have you used cannabis?</label>
                  <CustomSelect
                    className="large"
                    value={convertDateToCannabisYear(this.state.model.usingCannabisSince)}
                    clearable={false}
                    options={CANNABIS_USAGE_PERIOD_OPTIONS}
                    placeholder="I'd rather not say"
                    onChange={(e) => {
                      this.setState({
                        model: {
                          ...this.state.model,
                          usingCannabisSince: convertCannabisYearToDate(e.value),
                        },
                      });
                    }}
                  />
                  <Field
                    className="profileEditForm__hiddenInput accent"
                    name="usingCannabisSince"
                    id="usingCannabisSince"
                  />
                  <ValidationMessage for="usingCannabisSince" />
                </div>
              </div>
              <div className="row mb-xl">
                <div className="small-12 large-6 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="province"
                  >Province</label>
                  <CustomSelect
                    className="large"
                    value={this.state.model.province}
                    clearable={false}
                    options={FILTER_PROVINCE_OPTIONS}
                    placeholder="I'd rather not say"
                    onChange={(e) => {
                      this.setState({
                        model: {
                          ...this.state.model,
                          province: e.value,
                        },
                      });
                    }}
                  />
                  <Field
                    className="profileEditForm__hiddenInput accent"
                    name="province"
                    id="province"
                  />
                  <ValidationMessage for="province" />
                </div>
                <div className="small-12 large-6 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="city"
                  >City</label>
                  <Field
                    className="accent"
                    name="city"
                    id="city"
                    type="text"
                  />
                  <ValidationMessage for="city" />
                </div>
              </div>
              <div className="row mb-xl">
                <div className="small-12 medium-12 column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="bio"
                  >Bio</label>
                  <Field
                    className="accent profileEditForm__bioInput"
                    name="bio"
                    id="bio"
                    type="textarea"
                    rows="5"
                  />
                  <ValidationMessage for="bio" />
                </div>
              </div>
              <div className="row align-bottom mb-mn">
                <div className="column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="condition"
                  >Medical Conditions</label>
                  <input
                    className="accent"
                    id="condition"
                    type="text"
                    value={this.state.condition}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    onChange={(e) => this.setState({ condition: e.target.value })}
                  />
                </div>
                <div className="shrink column">
                  <Button
                    className="button secondary"
                    onClick={this.addCondition}
                  >
                    Add Condition
                    <Icon
                      className="ml-mn"
                      glyph={IconPlus}
                      size={14}
                    />
                  </Button>
                </div>
              </div>
              <div className="row mb-xl nm">
                {
                  this.state.knownConditions.map((condition) => <ConditionTag
                    key={generate()}
                    name={condition}
                    removeCondition={this.removeCondition}
                  />)
                }
              </div>
              <div className="row align-middle fs-mn mb-sm">
                <div className="shrink column">
                  <Checkbox
                    checked={this.state.isAnonymous}
                    onChange={(e) => this.setState({
                      isAnonymous: e.target.checked,
                    })}
                  >Hide my name & location from others</Checkbox>
                </div>
                <div className="column npl">
                  <QuestionBadge content={questionBadgeContent} />
                </div>
              </div>
              <div className="row column fs-mn mb-xxl">
                Personal details will only be visible to you while you&apos;re logged in.
                Visit our
                <Link
                  to="/privacy"
                  target="_blank"
                >
                  privacy policy
                </Link> for more information.
              </div>
              <div className="mb-md">
                <Button
                  className="button secondary spacious expanded"
                  type="submit"
                >{isLoading && <Spinner className="mr-sm" />}Save</Button>
              </div>
              <div className="text-center c-danger mt-md">{error}</div>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default ProfileEditForm;
