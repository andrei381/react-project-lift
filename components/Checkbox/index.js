// @flow

import React from 'react';
import { generate } from 'shortid';
import cx from 'classnames';

import './styles.scss';

type Props = {
  className?: string,
  children?: React.Element<any>,
  onChange?: Function,
  id?: string,
  checked: boolean,
}

const CheckBox = (props: Props) => {
  const { className, children, onChange, id, checked } = props;
  const mergedClassName = cx('checkbox', className);
  let actualId;
  if (!id) {
    actualId = generate();
  } else {
    actualId = id;
  }
  return (
    <span className={mergedClassName}>
      <input
        className="checkbox__input"
        type="checkbox"
        id={actualId}
        onChange={onChange}
        checked={checked}
      />
      <label
        className="checkbox__label"
        htmlFor={actualId}
      >{children}</label>
    </span>
  );
};

export default CheckBox;
