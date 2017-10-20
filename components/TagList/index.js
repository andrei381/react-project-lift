// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';

import Input from 'components/Input';
import Button from 'components/Button';
import Icon from 'components/Icon';
import IconPlus from 'images/sprite/plus.svg';

import TagItem from './TagItem';
import './styles.scss';

type Props = {
  values: Array<string>,
  readOnly?: boolean,
  className?: string,
  onChange?: Function,
  inputPlaceholder?: string,
};

class TagList extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }
  state: {
    inputValue: string,
  }
  onRemove = (index: number) => {
    const { values, onChange } = this.props;
    if (index > -1) {
      values.splice(index, 1);
      if (onChange) {
        onChange(values);
      }
      this.forceUpdate();
    }
  }
  onChangeHandler = (value, fromClick) => {
    this.setState({ inputValue: value });
    if (fromClick) {
      setTimeout(() => {
        this.setState({ inputValue: '' });
      }, 25);
    }
  }
  addValueFromBtnClick = () => {
    const val = this.state.inputValue;
    if (val) {
      const newVals = this.props.values;
      newVals.push(val);
      this.onChangeHandler(newVals, true);
    }
  }
  addValueFromKeydown = (event: Object) => {
    const { values, onChange } = this.props;
    const value = event.target.value;
    const keyCode = event.key;
    if (keyCode === 'Enter' && value) {
      event.preventDefault();
      values.push(value);
      if (onChange) {
        onChange(values);
      }
    }
    if (keyCode === 'Enter' || keyCode === 'Escape') {
      this.setState({
        inputValue: '',
      });
    }
  }
  props: Props
  render() {
    const { values, readOnly = false, className, inputPlaceholder } = this.props;
    const mergedClassName = cx('tagList', className);
    const placeholder = inputPlaceholder || 'Enter text here...';
    return (
      <div className={mergedClassName}>
        <div className="tagList__list">
          {values.map((value, key) => (
            <TagItem
              value={value}
              readOnly={readOnly}
              key={generate()}
              onRemove={() => (this.onRemove(key))}
            />
          ))}
        </div>
        {readOnly === false &&
          <div className="tagList__controlSection">
            <Input
              className="small-10"
              placeholder={placeholder}
              onKeyDown={this.addValueFromKeydown}
              onChange={(value) => this.onChangeHandler(value)}
              value={this.state.inputValue}
            />
            <Button
              className="tagList__button secondary"
              onClick={() => this.addValueFromBtnClick()}
            >
              <Icon
                glyph={IconPlus}
                size={12}
                className="tagList__buttonPlus"
              />
            </Button>
          </div>
        }
      </div>
    );
  }
}

export { TagItem };
export default TagList;
