// @flow

import React, { Component } from 'react';
import ReactSelect from 'react-select';
import cx from 'classnames';

import Icon from 'components/Icon';
import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';

import './styles/default.scss';

type Props = {
  splitLabel?: string,
  options?: Array<Object>,
  className?: string,
  multi?: boolean,
  value?: ?string,
  clearable?: boolean,
  searchable?: boolean,
  meta?: Array<string>,
  onChange?: Function,
  placeholder?: string,
};

class Select extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      isToggled: false,
    };
  }
  state: {
    isToggled: boolean,
  }

  onChangeHandler = (val: string) => {
    const { onChange, meta } = this.props;
    if (onChange) onChange(val, meta);
  }

  onOpen = () => {
    this.setState({ isToggled: true });
  }

  onClose = () => {
    this.setState({ isToggled: false });
  }

  arrowRenderer = () => (
    <Icon
      glyph={this.state.isToggled ? ChevronUp : ChevronDown}
      size={10}
    />
  )

  props: Props

  render() {
    const {
      splitLabel,
      options,
      className,
      multi,
      value,
      placeholder,
      clearable,
      searchable = false,
    } = this.props;

    const containerClassName = cx('reactSelect', className, { 'reactSelect--hasSplitLabel': splitLabel });

    return (
      <div className={containerClassName}>
        {splitLabel && <div className="reactSelect__splitLabel">{splitLabel}</div>}
        <ReactSelect
          arrowRenderer={this.arrowRenderer}
          searchable={searchable}
          options={options}
          multi={multi}
          value={value}
          clearable={clearable}
          onChange={this.onChangeHandler}
          placeholder={placeholder}
          onOpen={this.onOpen}
          onClose={this.onClose}
        />
      </div>
    );
  }
}

export default Select;
