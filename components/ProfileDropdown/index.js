// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { generate } from 'shortid';

import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/Tab';
import Icon from 'components/Icon';

import IconDown from 'images/sprite/chevron-down-blue.svg';
import './styles.scss';

const menuItems = [
  {
    link: '/me',
    title: 'My Profile',
  },
  {
    link: '/me/rewards',
    title: 'My Rewards',
  },
  {
    link: '/me/reviews',
    title: 'My Reviews',
  },
];

type State = {
  open: boolean,
}
type Props = {
  pathname: string,
}
class ProfileDropdown extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  state: State
  props: Props
  render() {
    const { open } = this.state;
    const { pathname } = this.props;
    return (
      <div>
        <div className="profileDropdown show-for-small-only">
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className="profileDropdown__selectedItem"
            onClick={() => this.setState({ open: !open })}
          >
            {
              menuItems.map((item) => (
                item.link === pathname ? item.title : ''
              ))
            }
            <Icon
              glyph={IconDown}
              size={14}
            />
          </div>
          <ul className={cx('profileDropdown__menu', { 'profileDropdown__menu--open': open })}>
            {
              menuItems.map((item) => (
                <Link
                  className="profileDropdown__menuLink"
                  to={item.link}
                  key={generate()}
                >
                  <li // eslint-disable-line jsx-a11y/no-static-element-interactions
                    className={cx('profileDropdown__menuItem', { 'profileDropdown__menuItem--selected': item.link === pathname })}
                    onClick={() => this.setState({ open: !open })}
                  >{item.title}</li>
                </Link>
              ))
            }
          </ul>
        </div>
        <ButtonGroup className="hide-for-small-only air expanded mb-xl">
          <Tab to="/me/edit">My Profile</Tab>
          <Tab to="/me/rewards">My Rewards</Tab>
          <Tab to="/me/reviews">My Reviews</Tab>
        </ButtonGroup>
      </div>
    );
  }
}

export default ProfileDropdown;
