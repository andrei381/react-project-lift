// @flow

import React, { Component } from 'react';

import './styles.scss';

type Props = {
  type?: string,
  className?: string,
  onChange?: Function,
  onKeyUp?: Function,
  onKeyDown?: Function,
  onKeyPress?: Function,
  autoFocus?: boolean,
  placeholder?: string,
  value?: string,
  name?: string,
  id?: string,
}

class Input extends Component {
  static defaultProps = {
    type: 'text',
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.inputElement.focus();
    }
  }

  props: Props
  inputElement: HTMLElement
  render() {
    const { onChange, ...otherProps } = this.props;
    return (
      <input
        onChange={(e) => { if (onChange) onChange(e.target.value); }}
        ref={(input) => { this.inputElement = input; }}
        {...otherProps}
      />
    );
  }
}

export default Input;
