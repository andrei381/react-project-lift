// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { Link } from 'react-router';

import cx from 'classnames';
import MenuItem from 'components/Header/MainMenu/MenuItem';

type Props = {
  text: string,
  data: Array<Object>,
  className?: string,
};

class SubMenu extends Component {
  constructor() {
    super();
    this.state = {
      isMenuOpen: true,
    };
  }
  state: Object
  props: Props

  render() {
    const { text, data, className } = this.props;
    const mergedClassName = cx('mainMenu__subMenu', className);
    const subLinkClassName = cx('mainMenu__link', (this.state.isMenuOpen ? 'mainMenu__link--opened' : 'mainMenu__link--closed'));
    return (
      <div
        className={mergedClassName}
      >
        <Link
          role="button"
          className={subLinkClassName}
          onClick={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}
        >
          {text}
        </Link>

        { this.state.isMenuOpen && data.map(({ link: itemLink, text: itemText }) => (
          <MenuItem
            text={itemText}
            link={itemLink}
            key={generate()}
            containerClassName={false}
            className="mainMenu__subMenuItem"
          />
        ))}
      </div>
    );
  }
}

export default SubMenu;
