// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import Icon from 'components/Icon';
import './styles.scss';

type Props = {
  name: string,
  options: Array<Object>,
  className?: string,
  itemClassName?: string,
  onChange: Function,
  value?: any,
};

class ImageRadioGroup extends Component {
  constructor(props: Props) {
    super();
    this.state = {
      selectedOption: props.value,
    };
  }
  state: {
    selectedOption: any,
  }
  props: Props
  render() {
    const { className, itemClassName, options, onChange, name } = this.props;
    const mergedClassName = cx('imageRadioGroup', className);
    return (
      <div className={mergedClassName}>
        {options.map((item) => (
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className={itemClassName}
            key={generate()}
            onClick={() => {
              this.setState({ selectedOption: item.value });
              onChange(item.value);
            }}
          >
            <div className="row">
              <div className="column shrink ">
                <Icon
                  glyph={item.icon}
                  size={60}
                  className="imageRadioGroup__icon"
                />
                <div className="mb-sm fs-md text-center">
                  <input
                    type="radio"
                    className="imageRadioGroup__option"
                    name={name}
                    value={item.value}
                    onClick={() => {
                      this.setState({ selectedOption: item.value });
                      onChange(item.value);
                    }}
                    defaultChecked={item.value === this.state.selectedOption}
                  /> {item.title}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    );
  }
}

export default ImageRadioGroup;
