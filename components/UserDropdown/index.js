// @flow

import React from 'react';
import { Link } from 'react-router';

import Icon from 'components/Icon';
import IconPencil from 'images/sprite/pencil.svg';
import Dropdown from 'components/Dropdown';

import './styles.scss';

type Props = {
  data: Object,
  logout: Function,
};

const UserDropdown = ({ data, logout }: Props) => (
  <Dropdown
    dropdownContent={
      <ul className="userDropdown__menu hide-for-small-only">
        <li className="userDropdown__menuItem">
          <Link
            to="/me"
            className="userDropdown__username"
          >
            {data.get('username')}
            <Icon
              glyph={IconPencil}
              size={12}
              className="userDropdown__editIcon"
            />
          </Link>
        </li>
        <li className="userDropdown__menuItem">
          <Link
            className="userDropdown__menuLink"
            to="/me/rewards"
          >My Rewards</Link>
        </li>
        <li className="userDropdown__menuItem">
          <Link
            className="userDropdown__menuLink"
            to="/me/reviews"
          >My Reviews</Link>
        </li>
        <li className="userDropdown__menuItem">
          <Link
            className="userDropdown__menuLink"
            to="/create-review"
          >Create a Review</Link>
        </li>
        <li className="userDropdown__menuItem">
          <div className="userDropdown__menuItemContainer">
            <Link
              className="userDropdown__menuLink"
              onClick={logout}
            >Logout</Link>
          </div>
        </li>
      </ul>
  }
    closeOnClickOutside
    dropdownPosition="bottom"
  >
    <div className="userDropdown hide-for-small-only">
      <div
        className="userDropdown__avatar"
        style={{ backgroundImage: `url(${data.get('picture')})` }}
      />
      <div className="userDropdown__points">{data.getIn(['pointWallet', 'balance'], 0)} lift points</div>
    </div>
  </Dropdown>
);

export default UserDropdown;
