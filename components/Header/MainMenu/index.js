// @flow

import React from 'react';
import { generate } from 'shortid';

import DropdownMenu from './DropdownMenu';
import SubMenu from './SubMenu';
import MenuItem from './MenuItem';

import './styles.scss';

const items: Array<Object> = [
  {
    text: 'Shop',
    children: [
      {
        text: 'Explore Strains',
        link: '/strains',
      },
      {
        text: 'Explore Oils',
        link: '/oils',
      },
      {
        text: 'Buy Accessories',
        link: '/products',
      },
    ],
  },
  {
    text: 'Find',
    children: [
      {
        text: 'Doctors',
        link: '/doctors',
      },
      {
        text: 'Producers',
        link: '/producers',
      },
      {
        text: 'Dispensaries',
        link: '/dispensaries',
      },
    ],
  },
  {
    text: 'News',
    link: 'https://news.lift.co',
  },
  {
    text: 'Lift Rewards',
    link: '/rewards',
  },
];

const MainMenu = () => (
  <div className="mainMenu">
    {items.map(({ text, link, children }) => (
      children ?
        <div
          key={generate()}
          className="mainMenu__item"
        >
          <DropdownMenu
            data={children}
            text={text}
            link={link}
            className="hide-for-small-only"
          />
          <SubMenu
            data={children}
            text={text}
            className="show-for-small-only"
          />
        </div>
      :
        <MenuItem
          text={text}
          link={link}
          key={generate()}
        />
    ))}
  </div>
);

export default MainMenu;
