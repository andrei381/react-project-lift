// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import Icon from 'components/Icon';
import IconClose from 'images/sprite/close.svg';
import RangeSlider from 'components/RangeSlider';
import ProgressBar from 'components/ProgressBar';

import './styles.scss';

type Props = {
  data: Object,
  readOnly?: boolean,
  className?: string,
  onRemove: Function,
  onChange?: Function,
};

class EffectItem extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.data.value,
    };
  }
  state: {
    value: number,
  }

  onChange = (value: any) => {
    this.setState({ value });
    this.props.onChange(value);
  }
  render() {
    const { data, readOnly = false, onRemove, className } = this.props;
    const mergedClassName = cx('effectItem', className);
    return (
      <div className={mergedClassName}>
        <div className="row align-middle">
          <div className="column small-12 medium-3">
            {data.name}
          </div>
          <div className="column small-12 medium-7 large-8">
            {readOnly === true ?
              <ProgressBar
                value={data.value}
                maxValue={10}
              />
              :
              <RangeSlider
                value={this.state.value}
                maxValue={10}
                onChange={this.onChange}
              />
            }
          </div>
          {readOnly === false &&
            <Icon
              glyph={IconClose}
              size={12}
              className="effectItem__close column"
              onClick={onRemove}
            />
          }
        </div>
      </div>
    );
  }
}

export default EffectItem;
