// @flow

import React, { Component } from 'react';
import { Dropdown } from 'react-foundation-components/lib/global/dropdown';

import './styles.scss';

type Props = {
  dropdownContent: React.Element<any>,
  children?: React.Element<any>,
};

class DropdownComponent extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  state: {
    show: boolean,
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = () => this.setState({ show: false });
  handleToggle = (e: Object) => {
    this.setState({ show: !this.state.show });
    e.stopPropagation();
  }

  props: Props
  render() {
    const { children, dropdownContent } = this.props;
    return (
      <div className="dropdownContainer">
        <div  // eslint-disable-line jsx-a11y/no-static-element-interactions
          onClick={this.handleToggle}
        >
          {children}
        </div>
        {this.state.show &&
          <Dropdown
            onClick={this.handleToggle}
          >
            {dropdownContent}
          </Dropdown>
        }
      </div>
    );
  }
}

export default DropdownComponent;
