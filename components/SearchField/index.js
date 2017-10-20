// @flow

import React, { Component } from 'react';
import cx from 'classnames';

import Input from 'components/Input';
import Button from 'components/Button';
import Icon from 'components/Icon';

import MarkerIcon from 'images/sprite/map-marker.svg';
import SearchIcon from 'images/sprite/search.svg';
import './styles.scss';

type Props = {
  onChange?: Function,
  onSubmit?: Function,
  value?: string,
  className?: string,
  location?: string,
  placeholder?: string,
}

class SearchField extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }
  state: Object
  props: Props
  render() {
    const { onChange, onSubmit, value, className, location, placeholder } = this.props;
    const mergedClassName = cx('searchField', className);
    const refinedPlaceholder = placeholder || 'Search';
    return (
      <div className={mergedClassName}>
        <Input
          className="searchField__input"
          placeholder={refinedPlaceholder}
          onChange={onChange}
          value={value}
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              if (onSubmit) onSubmit(this.state.value);
            }
          }}
        />
        {location && <div className="searchField__location">
          <Icon
            className="searchField__locationIcon"
            glyph={MarkerIcon}
            size={14}
          />
          <span className="searchField__locationText hide-for-small-only">in {location}</span>
        </div>}
        <Button
          className="searchField__button secondary"
          element="button"
          onClick={() => { if (onSubmit) onSubmit(this.state.value); }}
        >
          <Icon
            className="searchField__icon"
            glyph={SearchIcon}
            size={14}
          />
        </Button>
      </div>
    );
  }
}

export default SearchField;
