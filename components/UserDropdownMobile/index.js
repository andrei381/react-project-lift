// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { Link } from 'react-router';
import cx from 'classnames';

import Icon from 'components/Icon';
import IconPencil from 'images/sprite/pencil.svg';
import IconClose from 'images/sprite/close.svg';

import './styles.scss';

type Props = {
  data: Object,
  logout: Function,
};

const userMenuData = [
  {
    label: 'My Rewards',
    title: '/me/rewards',
  },
  {
    label: 'My Reviews',
    title: '/me/reviews',
  },
  {
    label: 'Create a Review',
    title: '/create-review',
  },
];

class UserDropdownMobile extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  state: {
    isOpen: boolean,
  }
  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }
  props: Props
  render() {
    const { data, logout } = this.props;
    const className = cx('userDropdownMobile__menu', { isOpen: this.state.isOpen });
    return (
      <div className="text-left show-for-small-only">
        <Link
          className="userDropdownMobile"
          onClick={this.toggleMenu}
        >
          <div
            className="userDropdownMobile__avatar"
            style={{ backgroundImage: `url(${data.get('picture')})` }}
          />
          <div className="userDropdownMobile__points">{data.getIn(['pointWallet', 'balance'], 0)} lift points</div>
        </Link>
        <ul className={className}>
          <li className="userDropdownMobile__menuItem">
            <span>{data.get('username')}</span>
            <Link
              to="/me"
              onClick={this.toggleMenu}
            >
              <Icon
                glyph={IconPencil}
                size={12}
                className="userDropdownMobile__editIcon"
              />
            </Link>
          </li>
          <Icon
            className="userDropdownMobile__closeIcon"
            glyph={IconClose}
            size={15}
            onClick={this.toggleMenu}
          />
          {userMenuData.map((value) => (
            <li
              key={generate()}
              className="userDropdownMobile__menuItem"
            >
              <Link
                className="userDropdownMobile__menuLink"
                to={value.title}
                onClick={this.toggleMenu}
              >{value.label}</Link>
            </li>
          ))}
          <li className="userDropdownMobile__menuItem">
            <Link
              className="userDropdownMobile__menuLink"
              onClick={logout}
            >Logout</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserDropdownMobile;
