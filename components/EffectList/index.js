// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';

import Input from 'components/Input';
import Button from 'components/Button';
import Icon from 'components/Icon';
import IconPlus from 'images/sprite/plus.svg';

import EffectItem from './EffectItem';
import './styles.scss';

type Props = {
  values: Array<Object>,
  readOnly?: boolean,
  className?: string,
  onChange?: Function,
  inputPlaceholder?: string,
};

class EffectList extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      values: props.values,
      inputValue: '',
    };
  }
  state: {
    values: Array<Object>,
    inputValue: string,
  }
  onRemove = (index: number) => {
    const { onChange } = this.props;
    const { values } = this.state;
    if (index > -1) {
      values.splice(index, 1);
      this.setState({ values });
      if (onChange) {
        onChange(values);
      }
    }
  }
  onChange = (index: number, value: number) => {
    const { onChange } = this.props;
    const { values } = this.state;
    if (index > -1) {
      const valueItem = values[index];
      valueItem.value = value;
      values[index] = valueItem;
      if (onChange) {
        onChange(values);
      }
    }
  }
  addValueFromBtnClick = () => {
    const values = this.state.values || [];
    const value = this.state.inputValue;
    if (value) {
      values.push({
        name: value,
        value: 5,
      });
      this.onChange(values);
      setTimeout(() => {
        this.setState({
          inputValue: '',
        });
      }, 25);
    }
  }
  addValue = (event: Object) => {
    const { onChange } = this.props;
    let { values } = this.state;
    const value = event.target.value;
    const keyCode = event.key;
    if (keyCode === 'Enter' && value) {
      event.preventDefault();
      values = values.push({
        name: value,
        value: 5,
      });
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
    const { readOnly = false, className, inputPlaceholder } = this.props;
    const { values } = this.state;
    const mergedClassName = cx('effectList', className);
    const placeholder = inputPlaceholder || 'Enter text here';
    const instructions = 'Drag the bar left (weak) or right (strong) to indicate strength of effect';
    return (
      <div className={mergedClassName}>
        <div className="effectList__list">
          {!readOnly && (values.length > 0) && <p className="text-center">{instructions}</p>}
          {values.map((value, key) => (
            <EffectItem
              data={value}
              readOnly={readOnly}
              key={generate()}
              onRemove={() => (this.onRemove(key))}
              onChange={(val) => { this.onChange(key, val); }}
            />
          ))}
        </div>
        {readOnly === false &&
          <div className="effectList__controlSection">
            <Input
              className="small-10"
              placeholder={placeholder}
              onKeyDown={this.addValue}
              onChange={(value) => { this.setState({ inputValue: value }); }}
              value={this.state.inputValue}
            />
            <Button
              className="effectList__button secondary"
              onClick={() => this.addValueFromBtnClick()}
            >
              <Icon
                glyph={IconPlus}
                size={12}
                className="effectList__buttonPlus"
              />
            </Button>
          </div>
        }
      </div>
    );
  }
}

export default EffectList;
