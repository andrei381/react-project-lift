// @flow

import React from 'react';
import { Link } from 'react-router';
import { generate } from 'shortid';

import Icon from 'components/Icon';
import Logo from 'images/sprite/logo.svg';
import InstagramIcon from 'images/sprite/instagram.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import FacebookIcon from 'images/sprite/facebook.svg';
import './styles.scss';

const socialLinks = [
  {
    href: 'https://www.instagram.com/liftcanada',
    glyph: InstagramIcon,
  },
  {
    href: 'https://www.twitter.com/liftcannabis',
    glyph: TwitterIcon,
  },
  {
    href: 'https://www.facebook.com/liftcann',
    glyph: FacebookIcon,
  },
];

const Footer = () => (
  <div className="footer">
    <div className="footer__topLine row">
      <div className="footer__logoContainer small-12 medium-shrink column">
        <Icon
          glyph={Logo}
          width={48}
          height={30}
          className="footer__logo"
        />
        {socialLinks.map(({ href, glyph }) =>
          <a // eslint-disable-line jsx-a11y/href-no-hash
            className="footer__socialItem"
            key={generate()}
            href={href}
            target="_blank"
          >
            <Icon
              glyph={glyph}
              width={18}
              height={18}
              fill={'white'}
            />
          </a>
        )}
      </div>
      <div className="column">
        <div className="row footer__menuContainer">
          <div className="small-6 medium-shrink column">
            <ul className="footer__menu">
              <li className="footer__menuTitle">Shop</li>
              <li>
                <Link
                  className="footer__menuItem"
                  to="/strains"
                >Strains</Link>
              </li>
              <li>
                <Link
                  className="footer__menuItem"
                  to="/oils"
                >Oils</Link>
              </li>
              <li>
                <Link
                  className="footer__menuItem"
                  to="/products"
                >Accessories</Link>
              </li>
            </ul>
          </div>

          <div className="small-6 medium-shrink column">
            <ul className="footer__menu">
              <li className="footer__menuTitle">Find</li>
              <li>
                <Link
                  className="footer__menuItem"
                  to="/doctors"
                >Doctors</Link>
              </li>
              <li>
                <Link
                  className="footer__menuItem"
                  to="/producers"
                >Producers</Link>
              </li>
              <li>
                <Link
                  className="footer__menuItem"
                  to="/dispensaries"
                >Dispensaries</Link>
              </li>
            </ul>
          </div>

          <div className="small-6 medium-shrink column">
            <ul className="footer__menu">
              <li className="footer__menuTitle">Company</li>
              <li>
                <Link
                  className="footer__menuItem"
                  to="/about"
                >About Us</Link>
              </li>
              <li>
                <a
                  className="footer__menuItem"
                  href="https://jobs.lift.co/"
                  target="_blank"
                >Careers</a>
              </li>
            </ul>
          </div>

          <div className="small-12 medium-6 medium-shrink column">
            <ul className="footer__menu">
              <li className="footer__menuButton">
                <a href="https://lp.lift.co">LP login / signup</a>
              </li>
              <li className="footer__menuButton">
                <a href="https://md.lift.co">Clinic login / signup</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="footer__copy column">
        <span className="footer__copy--item">1 800 681 1593</span>&nbsp;|&nbsp;
        <span className="footer__copy--item">hello@lift.co</span>&nbsp;|&nbsp;
        <span className="footer__copy--item">@2017 Lift Co Ltd.</span>&nbsp;|&nbsp;
        <span className="footer__copy--item">
          <Link
            className="footer__terms"
            to="/privacy"
          >Privacy Policy</Link>
        </span>
      </div>
    </div>
  </div>
);

export default Footer;
