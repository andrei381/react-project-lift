// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import Breadcrumbs from 'components/Breadcrumbs';
import BorderedTitle from 'components/BorderedTitle';
import PageBanner from 'components/PageBanner';
import Button from 'components/Button';
import Panel from 'components/Panel';
import Icon from 'components/Icon';
import Link from 'components/Link';

import DoctorImg from 'images/sprite/doctor.svg';
import ProducerImg from 'images/sprite/producer.svg';
import AccessoryImg from 'images/sprite/accessory.svg';
import NewsImg from 'images/sprite/news.svg';
import QuestionImg from 'images/sprite/question.svg';
import EventImg from 'images/sprite/event.svg';

import Banner from './banner.jpg';
import SignUpImg from './sign-up.jpg';
import FindImg from './find.jpg';
import JoinImg from './join.jpg';

const features: Array<Object> = [
  {
    img: DoctorImg,
    text: 'Locate a doctor',
    link: '/doctors',
  },
  {
    img: AccessoryImg,
    text: 'Buy accessories',
    link: '/products',
  },
  {
    img: ProducerImg,
    text: 'Choose the right Licensed Producer',
    link: '/producers',
  },
  {
    img: NewsImg,
    text: 'Read the latest cannabis news',
    link: 'https://news.lift.co/',
  },
  {
    img: QuestionImg,
    text: 'Ask questions in our advice forum',
  },
  {
    img: EventImg,
    text: 'Find cannabis events in your area',
    link: 'https://events.lift.co/',
  },
];

class HowItWorksPage extends Component {
  render() {
    const breadcrumbPath = fromJS([
      {
        title: 'How it works',
      },
    ]);
    return (
      <div>
        <Helmet title="How it works" />
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={Banner}
          title="How it works"
          titleLarge
          subtitle="Cannabis can be complex. Lift simplifies it for you."
          bottomComponent={
            <Button
              className="secondary semiSpacious"
              element={Link}
              to="/register"
            >Register now</Button>
          }
        />
        <div className="row align-middle mb-xl">
          <div className="small-order-2 small-12 large-order-1 large-shrink column text-center">
            <img
              alt=""
              src={SignUpImg}
              role="banner"
            />
          </div>
          <div className="small-order-1 large-order-2 column pl-lg">
            <BorderedTitle>Sign up and join a community</BorderedTitle>
            <p>By registering on Lift, join a supportive community of Canadians interested in sharing their cannabis experiences with others. You’ll also gain access to our free patient guide. &nbsp;<Link to="/register">Sign up.</Link></p>
          </div>
        </div>

        <div className="row align-middle mb-xl">
          <div className="column pl-lg">
            <BorderedTitle>Find the right cannabis products and accessories</BorderedTitle>
            <p>We’ve grown Canada’s largest database of cannabis products and reviews left by real patients from across the country. It’s easy to find with ease accurate and up-to-date information about cannabis products and accessories. Plus, we make it easy to find the perfect strain for your condition. &nbsp;<Link to="/products">Find products and accessories.</Link></p>
          </div>
          <div className="small-12 large-shrink column text-center">
            <img
              alt=""
              src={FindImg}
              role="banner"
            />
          </div>
        </div>

        <div className="row align-middle mb-hg pb-xl has-b-b">
          <div className="small-order-2 small-12 large-order-1 large-shrink column text-center">
            <img
              alt=""
              src={JoinImg}
              role="banner"
            />
          </div>
          <div className="small-order-1 large-order-2 column pl-lg">
            <BorderedTitle>Join Lift Rewards and start collecting points</BorderedTitle>
            <p>Lift Rewards is Canada’s most comprehensive cannabis loyalty program. Earn Lift points for writing reviews, completing surveys or attending our events. You can then redeem your points for amazing rewards, including discounts on medical cannabis!* &nbsp;<Link to="/rewards">Join Lift Rewards.</Link></p>
          </div>
          <div className="small-order-3 small-12 column text-center mt-md"><p>*Available to prescription-holding patients at participating licensed producers.</p></div>
        </div>

        <div className="row column"><BorderedTitle centered>Other Features</BorderedTitle></div>
        <div className="row mb-xl">
          {features.map((item) => (
            <Link
              className="small-12 medium-6 column mb-mn c-inherit td-n"
              key={generate()}
              to={item.link}
            >
              <div className="row align-middle">
                <div className="shrink column npr">
                  <Icon
                    glyph={item.img}
                    size={30}
                  />
                </div>
                <div className="column"><h5 className="nm"><strong>{item.text}</strong></h5></div>
              </div>
            </Link>
          ))}
        </div>
        <Panel dark>
          <div className="row">
            <div className="small-12 large-shrink column">
              <h3>Are you a cannabis business looking to raise your brand’s profile?</h3>
            </div>
            <div className="shrink column">
              <Button className="secondary semiSpacious">
                <a
                  className="contactLink"
                  href="mailto:hello@lift.co"
                >
                  Contact us
                </a>
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    );
  }
}

export default HowItWorksPage;
