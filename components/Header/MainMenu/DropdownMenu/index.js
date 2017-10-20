// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';

import Link from 'components/Link';
import Dropdown from 'react-dd-menu';
import MenuItem from 'components/Header/MainMenu/MenuItem';

import './styles/react-dd-menu.scss';

type Props = {
  data: Array<Object>,
  text: string,
  link: string,
  className?: string,
}

class DropdownMenu extends Component {
  constructor() {
    super();
    this.state = {
      isMenuOpen: false,
    };
  }

  state: Object
  props: Props

  render() {
    const { data, text, link, className } = this.props;
    return (
      <Dropdown
        toggle={
          <MenuItem
            onClick={() => this.setState({ isMenuOpen: !this.state.isMenuOpen })}
            text={text}
            link={link}
            containerClassName={false}
          />
        }
        isOpen={this.state.isMenuOpen}
        close={() => this.setState({ isMenuOpen: false })}
        textAlign="left"
        menuAlign="left"
        size="sm"
        className={className}
      >
        { data.map(({ link: itemLink, text: itemText }) => (
          <li key={generate()}>
            <Link
              to={itemLink}
            >{itemText}</Link>
          </li>
        ))}
      </Dropdown>
    );
  }
}

export default DropdownMenu;
