// @flow

import React from 'react';
import Helmet from 'components/Helmet';
import { fromJS } from 'immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import BorderedTitle from 'components/BorderedTitle';
import Team from 'components/Team';
import PageBanner from 'components/PageBanner';
import Button from 'components/Button';
import Panel from 'components/Panel';

import AboutBanner from 'images/banners/about.jpg';
import './styles.scss';

const AboutPage = () => {
  const breadcrumbPath = fromJS([
    {
      link: '',
      title: 'About',
    },
  ]);
  return (
    <div className="aboutPage">
      <Helmet title="About" />
      <Breadcrumbs path={breadcrumbPath} />
      <PageBanner
        bg={AboutBanner}
        title="Say hello to Lift"
        titleLarge
        subtitle="Our team is at the heart of what we do"
      />
      <div className="row mb-xxl">
        <div className="small-12 medium-6 column">
          <BorderedTitle>Our Story</BorderedTitle>
          <p>Lift first started in 2013 when Health Canada implemented a new federal medical marijuana program called the Marihuana for Medical Purposes Regulations (MMPR). At the time, very little information was available about how this new program worked, who the licensed producers were, and if their products were even any good and a massive shift in how Canadian patients accessed medical cannabis was taking place.</p>
          <p>After recognizing the impact that these new large-scale producers would have on the industry in Canada and the types of questions and concerns that would inevitably arise, Tyler Sookochoff founded Lift and its first website (launched in January of 2014) and quickly caught on.</p>
          <p>What started as a simple informational website listing Canada’s medical marijuana regulations has grown into an expansive technology and media brand covering every facet of the cannabis industry, both in-person and online. Lift has truly become the meeting place for cannabis in Canada.</p>
        </div>
        <div className="small-12 medium-5 medium-offset-1 column">
          <h4 className="aboutPage__mission">Empowering everyone to make better informed decisions about cannabis.</h4>
        </div>
      </div>
      <Team />
      <div className="row column">
        <Panel dark>
          <div className="row">
            <div className="small-12 large-shrink column">
              <h3>Want to chat? We’re easy to get a hold of.</h3>
            </div>
            <div className="shrink column">
              <Button
                className="secondary semiSpacious"
                to="/contact"
              >Contact us</Button></div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AboutPage;
