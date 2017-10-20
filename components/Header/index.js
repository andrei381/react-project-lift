// @flow

import React from 'react';
import Link from 'components/Link';
import cx from 'classnames';

import Icon from 'components/Icon';
import Logo from 'images/sprite/logo.svg';
import Button from 'components/Button';
import UserDropdown from 'components/UserDropdown';
import UserDropdownMobile from 'components/UserDropdownMobile';

import MainMenu from './MainMenu';
import SecondaryMenu from './SecondaryMenu';
import Hamburger from './Hamburger';
import CartMenu from './CartMenu';


import './styles.scss';

type Props = {
  user: Object,
  logout: Function,
  openCart: Function,
  replace: Function,
  itemCount: number,
  navbarOpen: boolean,
  closeNavbar: Function,
  openNavbar: Function,
}

const Header = ({ user, logout, replace, itemCount, openCart, navbarOpen, closeNavbar, openNavbar }: Props) => {
  const className = cx('header container', { navbarOpen });
  return (
    <div className={className}>
      <div className="row align-middle">
        <div className="small-order-2 shrink column mb-md">
          <Link to="/">
            <Icon
              glyph={Logo}
              width={48}
              height={30}
              className="header__logo"
              onClick={() => closeNavbar()}
            />
          </Link>
        </div>
        <div className="small-order-1 shrink column mb-md hide-for-medium align-self-right">
          <Hamburger
            closeNavbar={closeNavbar}
            openNavbar={openNavbar}
            isActive={navbarOpen}
          />
        </div>
        <div className="small-order-3 medium-order-4 column text-right">
          {user ?
            <div className="mb-md d-if">
              <UserDropdown
                data={user}
                logout={logout}
                replace={replace}
              />
              <UserDropdownMobile
                data={user}
                logout={logout}
                replace={replace}
              />
            </div> :
            <div className="text-right">
              <Button
                className="header__authBtn small secondary hollow mb-sm"
                element={Link}
                to="/register"
              >Join</Button>
              <Button
                className="header__authBtn small secondary mb-md ml-mn"
                element={Link}
                to="/login"
              >Login</Button>
            </div>
          }
        </div>
        <div className="small-order-5 shrink column text-right mb-md">
          <CartMenu
            openCart={openCart}
            itemCount={itemCount}
          />
        </div>
      </div>
      <div className="header__togglable header__togglable--bottomLine row">
        <div className="header__menuContainers small-12 medium-expand column">
          <MainMenu />
        </div>
        <div className="small-12 medium-shrink column">
          <SecondaryMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
