// @flow

import React from 'react';
import { generate } from 'shortid';

import BorderedTitle from 'components/BorderedTitle';

import Matei from 'images/headshots/matei.jpg';
import MateiAnimated from 'images/headshots/matei.gif';
import Tyler from 'images/headshots/tyler.jpg';
import TylerAnimated from 'images/headshots/tyler.gif';
import Zack from 'images/headshots/zack.jpg';
import ZackAnimated from 'images/headshots/zack.gif';
import David from 'images/headshots/david.jpg';
import DavidAnimated from 'images/headshots/david.gif';
import Peter from 'images/headshots/peter.jpg';
import PeterAnimated from 'images/headshots/peter.gif';
import Tara from 'images/headshots/tara.jpg';
import TaraAnimated from 'images/headshots/tara.gif';
import Dessy from 'images/headshots/dessy.jpg';
import DessyAnimated from 'images/headshots/dessy.gif';
import Devon from 'images/headshots/devon.jpg';
import DevonAnimated from 'images/headshots/devon.gif';
import Nicole from 'images/headshots/nicole.jpg';
import NicoleAnimated from 'images/headshots/nicole.gif';
import Ken from 'images/headshots/ken.jpg';
import KenAnimated from 'images/headshots/ken.gif';
import Nick from 'images/headshots/nick.jpg';
import NickAnimated from 'images/headshots/nick.gif';
import Nina from 'images/headshots/nina.jpg';
import NinaAnimated from 'images/headshots/nina.gif';
import Derek from 'images/headshots/derek.jpg';
import DerekAnimated from 'images/headshots/derek.gif';
import Yan from 'images/headshots/yan.jpg';
import YanAnimated from 'images/headshots/yan.gif';
import Thea from 'images/headshots/thea.jpg';
import TheaAnimated from 'images/headshots/thea.gif';
import Kayla from 'images/headshots/kayla.jpg';
import KaylaAnimated from 'images/headshots/kayla.gif';
import Tiah from 'images/headshots/tiah.jpg';
import TiahAnimated from 'images/headshots/tiah.gif';
import Dan from 'images/headshots/dan.jpg';
import DanAnimated from 'images/headshots/dan.gif';

import './styles.scss';

const teamMembers: Array<Object> = [
  {
    name: 'Matei Olaru',
    title: 'Chief Executive Officer',
    bio: 'Yogi, fearless leader, snack pirate',
    headshot: Matei,
    headshotAnimated: MateiAnimated,
  },
  {
    name: 'Tyler Sookochoff',
    title: 'Founder, Chief Marketing Officer',
    bio: 'Pretty good at some stuff',
    headshot: Tyler,
    headshotAnimated: TylerAnimated,
  },
  {
    name: 'David Brown',
    title: 'Communications Director, Editor in Chief',
    bio: 'Patients, plants, politics',
    headshot: David,
    headshotAnimated: DavidAnimated,
  },
  {
    name: 'Zachary Iles',
    title: 'Chief Technology Officer',
    bio: '',
    headshot: Zack,
    headshotAnimated: ZackAnimated,
  },
  {
    name: 'Peter Carscadden',
    title: 'Director of Sales',
    bio: 'Woodsman, technophile and lover of fast food',
    headshot: Peter,
    headshotAnimated: PeterAnimated,
  },
  {
    name: 'Tara Mcmanus',
    title: 'Office Manager',
    bio: 'Dog loving food making craft enthusiast',
    headshot: Tara,
    headshotAnimated: TaraAnimated,
  },
  {
    name: 'Dessy Pavlova',
    title: 'Media Project Manager',
    bio: 'Animal lover, cannabis connoisseur, straw that stirs the drink',
    headshot: Dessy,
    headshotAnimated: DessyAnimated,
  },
  {
    name: 'Devon Scoble',
    title: 'Lifestyle Content Director',
    bio: 'Reader, traveller, daydream believer',
    headshot: Devon,
    headshotAnimated: DevonAnimated,
  },
  {
    name: 'Nicole Orlowski',
    title: 'Creative Director',
    bio: 'Adobe! Sans Serif! Paint!',
    headshot: Nicole,
    headshotAnimated: NicoleAnimated,
  },
  {
    name: 'Ken Aber',
    title: 'Chief Strategy Officer',
    bio: 'Clarity, bold, changing social norms',
    headshot: Ken,
    headshotAnimated: KenAnimated,
  },
  {
    name: 'Nick Pateras',
    title: 'Director of Product Marketing​',
    bio: 'Humanoid creature, bipedal, cantankerous in the mornings',
    headshot: Nick,
    headshotAnimated: NickAnimated,
  },
  {
    name: 'Nina Rakic',
    title: 'Experiential Marketing and Events Manager​',
    bio: 'Creative, tenacious & insatiably curious',
    headshot: Nina,
    headshotAnimated: NinaAnimated,
  },
  {
    name: 'Derek Braid',
    title: 'Software Developer​',
    bio: 'Natural Resource. Wet and dry code',
    headshot: Derek,
    headshotAnimated: DerekAnimated,
  },
  {
    name: 'Yan Takushevich',
    title: 'Software Development Team Lead​',
    bio: 'Coder, thinker, adventurer',
    headshot: Yan,
    headshotAnimated: YanAnimated,
  },
  {
    name: 'Thea Mizuhara',
    title: 'Program Manager​',
    bio: 'Cat herder, Excel aficionado, aspiring infomercial star',
    headshot: Thea,
    headshotAnimated: TheaAnimated,
  },
  {
    name: 'Kayla Keip',
    title: 'Customer Experience Representative​',
    bio: 'Adventure seeker, travel enthusiast, nature lover',
    headshot: Kayla,
    headshotAnimated: KaylaAnimated,
  },
  {
    name: 'Tiah Moffatt',
    title: 'Account Management & Partner Acquisition',
    bio: 'Risk taker, coffee enthusiast, social butterfly',
    headshot: Tiah,
    headshotAnimated: TiahAnimated,
  },
  {
    name: 'Dan Lee',
    title: 'Digital Content Producer',
    bio: 'Director, producer, food consumer',
    headshot: Dan,
    headshotAnimated: DanAnimated,
  },
];

const Team = () => (
  <div className="row column mb-xxl">
    <div className="team">
      <div className="row">
        <div className="small-12 column">
          <BorderedTitle centered>Meet our team</BorderedTitle>
        </div>
        {teamMembers.map((member) => (
          <div
            className="team__member small-12 medium-3 column mb-lg"
            key={generate()}
          >
            <div className="team__picture">
              <img
                className="team__staticPicture"
                src={member.headshot}
                alt={member.name}
              />
              <img
                className="team__animatedPicture"
                src={member.headshotAnimated}
                alt={member.name}
              />
            </div>
            <div className="team__name mt-md">
              {member.name}
            </div>
            <p className="mb-mx"><strong>{member.title}</strong></p>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Team;
