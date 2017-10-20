// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import { replace } from 'react-router-redux';
import Helmet from 'components/Helmet';
import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import moment from 'moment/src/moment';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import transformOptions from 'utils/transformOptions';
import RadioButtonGroup from 'components/RadioButtonGroup';
import Breadcrumbs from 'components/Breadcrumbs';
import LinkButton from 'components/Button';
import BorderedTitle from 'components/BorderedTitle';
import HighlightCards from 'components/HighlightCards';
import ValidationMessage from 'components/ValidationMessage';
import Spinner from 'components/Spinner';
import Tooltip from 'components/Tooltip';
import Modal from 'components/Modal';
import Faq from 'components/Faq';
import CheckBox from 'components/Checkbox';
import { requestRewardsRegistration } from 'containers/App/sagas';
import terms from 'pages/TermsAndConditions/terms';

import CardsImg from './Cards.png';
import PhoneImg from './phone.jpg';
import LivByLiftImg from './liv.jpg';
import CardsIcon from './number-1-icon.jpg';
import PhoneIcon from './number-2-icon.jpg';
import LivByLiftIcon from './number-3-icon.jpg';
import RewardsBannerSVG from './BannerSVG';

import './styles.scss';

const isValidPostalCode = (postalCode) => {
  if (!postalCode) { return false; }
  const trimmedPostalCode = postalCode.toString().trim();
  const ca = new RegExp(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
  if (ca.test(trimmedPostalCode.toString().replace(/\W+/g, ''))) { return true; }
  return false;
};
const genderOptions = ['Male', 'Female', 'Other'];
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
    .when('$user', (user, passSchema) => user
      ? passSchema
      : passSchema.min(6, 'minimum password length is 6 characters').required()),
  firstname: yup
    .string()
    .min(2, 'minimum firstname length is 2 characters')
    .max(26, 'max firstname length is 26 characters')
    .required(),
  lastname: yup
    .string()
    .min(2, 'minimum lastname length is 2 characters')
    .max(26, 'max lastname length is 26 characters')
    .required(),
  postalcode: yup
    .mixed()
    .test('match', (code) => isValidPostalCode(code))
    .required(),
  birthday: yup
    .date()
    .max(moment(new Date()).subtract(18, 'years'))
    .required(),
  rewardsActivationCode: yup
    .string()
    .max(12),
  gender: yup.string()
    .oneOf(genderOptions)
    .required(),
  terms: yup
    .boolean()
    .required('Must Accept Terms and Conditions'),
});

const cards = fromJS([
  {
    src: CardsImg,
    icon: CardsIcon,
    title: 'Sign Up',
    desc: 'Signing up takes just a minute, and you’ll immediately be able to start earning Lift Points. Plus, just for signing up we’ll give you 50 points to get started!',
  },
  {
    src: PhoneImg,
    icon: PhoneIcon,
    title: 'Collect Points',
    desc: 'Earn Lift Points by writing a product or strain review, completing a survey or attending our events like the Lift Expo.',
  },
  {
    src: LivByLiftImg,
    icon: LivByLiftIcon,
    title: 'Unlock Rewards',
    desc: 'Some of the rewards you can unlock with your Lift Points include discounts on medical cannabis*, credit towards accessories on our online store, industry event tickets and many more!',
  },
]);

const rewardsFaq = fromJS([
  {
    question: 'How does it work?',
    answer: 'When you leave a medically-relevant and thoughtful review on Lift about a strain purchased from one of Canada\'s participating Licensed Producers, you’ll be rewarded with Lift Points. Points are not awarded for a second review left on a strain with the same batch number as one you\'ve already reviewed.',
  },
  {
    question: 'What can I do with points?',
    answer: [
      'If you’ve been collecting Lift Points, visit your Rewards Dashboard to see what rewards are available to you! There are two primary ways to redeem your points:',
      '1. Unlock a discount on your next purchase of medical cannabis through participating Licensed Producers, including Aphria Inc., ABcann, Broken Coast Cannabis, Canna Farms, Emblem, MedReleaf, OrganiGram, Peace Naturals Project Inc. and Tweed.',
      '2. Unlock a credit to any of our partners, which also includes the online Lift Store , where you can buy high-quality vaporizers and accessories.',
      'We’ll also offer other rewards customized just for you - these can range from other cannabis-related products to health & wellness activities or even restaurants and entertainment.',
    ],
  },
  {
    question: 'How many points do I get?',
    answer: 'A standard review can earn between 50-400 points and our wizard will guide you through the process. If you write a review that is deemed ‘medical quality’, you will receive an additional 100 points for a total of 500. Each 100 points is equal to $1.00.',
  },
  {
    question: 'Who decides how many points my review is worth?',
    answer: 'Points are calculated and awarded automatically by our team of robots based upon predefined rules; however, we also audit each review ourselves and reserve the right to adjust the points awarded at any time (sometimes up, sometimes down). If we find that your review is of medical quality, we’ll award you an additional 100 points!',
  },
  {
    question: 'What is a Medical Quality Review?',
    answer: 'So you want to write a Medical Quality Review! It’s not as hard as it sounds. Think of it as the information you would give your doctor to explain your experience. Factors like taste, smell, burn, etc., are all relevant points to cover in a review but they should be secondary to the medical effects.',
  },
  {
    question: 'What is a Medical Quality Review?',
    answer: [
      'So you want to write a Medical Quality Review! It’s not as hard as it sounds. Think of it as the information you would give your doctor to explain your experience. Factors like taste, smell, burn, etc., are all relevant points to cover in a review but they should be secondary to the medical effects.',
      'The most important aspect of a Medical Quality Review is detailing accurate medical information that will help other individuals – as well as producers and doctors – better understand how this strain will help them with their medical issue. For example, if you’re using cannabis to treat anxiety, let us know if it helped, how it helped, and if there were any side-effects that added to or detracted from the treatment.',
      'Your review should also offer information on your experience as a customer. Things to think about or answer in your review might be: was your Licensed Producer helpful throughout your buying experience? Did you feel the price was fair? Was the shipping time and cost acceptable? Would you recommend this Licensed Producer to other people?',
      'To recap: a Medical Quality Review is one that gives the Lift community comprehensive information about a patient’s medical experience with a strain. It need not necessarily be positive, it just needs to be informative.',
    ],
  },
  {
    question: 'Why did you start this program?',
    answer: 'It’s our way of helping out. We host a tight-knit community of patients who are sharing their daily experiences through reviews and we thought, “Why not reward their generosity”? Every review you write helps other patients treat their own medical conditions and get the relief they need. It’s a win-win for everyone!',
  },
  {
    question: 'My friend or family member is with the same LP as me but they don’t have an account. Can I review their strains to get more points?',
    answer: 'You can only review strains you’ve purchased with your prescription. When we validate with your LP, they verify that you have purchased all strains being reviewed and tie the redemption code directly to your file.',
  },
]);

type Props = {
  requestRewardsRegistration: Function,
  isLoading: boolean,
  error: string,
  user: Object,
  hideBreadcrumbs?: boolean,
  replace: Function,
}

class RewardsPage extends Component {
  constructor(props: Object) {
    super();
    const { user } = props;
    this.state = {
      model: {
        username: user ? user.get('username', '') : '',
        email: user ? user.get('email', '') : '',
        password: user ? user.get('password', '') : '',
        firstname: user ? user.get('firstName', '') : '',
        lastname: user ? user.get('lastName', '') : '',
        postalcode: '',
        birthday: null,
        gender: user ? user.get('gender', '') : '',
        rewardsActivationCode: '',
      },
    };
  }
  state: Object

  componentWillMount() {
    const { user } = this.props;
    if (user && user.get('rewardsEnabled')) {
      this.props.replace('/me/rewards');
    }
  }
  setUsernameWithEmail(email) {
    if (this.props.user) return;
    const model = this.state.model;
    model.username = email.split('@')[0];
    this.setState({ model });
  }
  props: Props
  render() {
    const { isLoading, error, user, hideBreadcrumbs } = this.props;
    const rewardsEnabled = user && (user.get('rewardsEnabled') || user.get('rewardsEnabledOn'));
    const rewardsActivationCodeTooltip = 'If you received an activation card, enter the code on the back to access your exclusive Rewards. If you didn\'t receive a card, you can still register for Rewards - just leave this code blank.';
    const medicalDisclaimer = '*Available to prescription-holding patients at participating licensed producers.';
    const rewardsExplainerTitle = 'Earn Lift Points. Unlock Cannabis Rewards.';
    const rewardsExplainerCopy = 'Members earn Lift Points that can be redeemed for a variety of rewards, including discounts off medical cannabis* and high-quality accessories. By signing up, members also get free access to exclusive promotions from our partners and invite-only industry events.';
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Lift Rewards™',
      },
    ]);
    return (
      <div>
        <Helmet title="Rewards" />
        {!hideBreadcrumbs && <Breadcrumbs path={breadcrumbPath} />}
        <div className="row column text-center">
          <RewardsBannerSVG />
        </div>
        <BorderedTitle
          centered
          element="h2"
          className="c-secondary mb-lg t-capitalize"
        >
          {rewardsExplainerTitle}
        </BorderedTitle>
        <div className="row column text-center">
          <p className="mb-lg">{rewardsExplainerCopy}</p>
          <HighlightCards
            cards={cards}
            borderedTitle
          />
        </div>
        <div className="row column mb-hg">
          <Form
            context={{ user }}
            schema={schema}
            value={this.state.model}
            onChange={(model) => this.setState({ model })}
            onSubmit={(e) => this.props.requestRewardsRegistration(e)}
          >
            <div className="small-12 medium-8 medium-offset-2 column center">
              {!user && <span>
                <div className="mb-lg">
                  <label htmlFor="email">Email address*</label>
                  <Field
                    className="accent"
                    name="email"
                    id="email"
                    type="email"
                    onChange={(email) => this.setUsernameWithEmail(email)}
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
              </span>}
              <div className="mb-lg">
                <label htmlFor="firstname">firstname*</label>
                <Field
                  className="accent"
                  name="firstname"
                  id="firstname"
                  type="text"
                />
                <ValidationMessage for="firstname" />
              </div>
              <div className="mb-lg">
                <label htmlFor="lastname">lastname*</label>
                <Field
                  className="accent"
                  name="lastname"
                  id="lastname"
                  type="text"
                />
                <ValidationMessage for="lastname" />
              </div>
              <div className="mb-lg">
                <label htmlFor="postalcode">Postal Code*</label>
                <Field
                  className="accent"
                  name="postalcode"
                  id="postalcode"
                  type="text"
                />
                <ValidationMessage for="postalcode" />
              </div>
              <div className="mb-lg">
                <label htmlFor="birthday">Date of Birth</label>
                <Field
                  className="accent"
                  name="birthday"
                  id="birthday"
                />
                <ValidationMessage for="birthday" />
              </div>
              <div className="mb-lg">
                <label htmlFor="gender">Gender</label>
                <RadioButtonGroup
                  className="expanded"
                  options={transformOptions(genderOptions)}
                  name="gender"
                  id="gender"
                  onChange={(gender) => this.setState({
                    model: {
                      ...this.state.model,
                      gender,
                    },
                  })}
                />
                <ValidationMessage for="gender" />
              </div>
              <div className="mb-lg">
                <label htmlFor="rewardsActivationCode">Activation Code</label>
                <Tooltip
                  tooltipPosition="top"
                  tooltipIndicator
                  tooltipContent={rewardsActivationCodeTooltip}
                >
                  <span className="rewardsPage__tooltipPrompt">?</span>
                </Tooltip>
                <Field
                  className="accent"
                  name="rewardsActivationCode"
                  id="rewardsActivationCode"
                  type="text"
                />
                <ValidationMessage for="rewardsActivationCode" />
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
              {!rewardsEnabled && <div className="text-center">
                <Button
                  className="button secondary spacious mt-md"
                  type="submit"
                >{isLoading && <Spinner className="mr-sm" />}register now</Button>
              </div>}
              <div className="text-center c-danger mt-md">{error}</div>
            </div>
          </Form>
        </div>
        {rewardsEnabled &&
          <div className="text-center mt-xl">
            <div className="mb-md">
              <h4>You have successfully registered for Lift Rewards.</h4>
              <LinkButton
                className="button primary spacious"
                element={Link}
                to="/me/rewards"
              >View Rewards</LinkButton>
            </div>
          </div>
        }
        <div className="row column">
          <Faq
            questions={rewardsFaq}
            title={'Rewards FAQ'}
          />
        </div>
        <p className="text-center">{medicalDisclaimer}</p>
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
  requestRewardsRegistration: (payload) => dispatch(requestRewardsRegistration(payload)),
  replace: (path) => dispatch(replace(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RewardsPage);
