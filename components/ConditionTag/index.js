// @flow

import React from 'react';

import './styles.scss';

type Props = {
  name: string,
  removeCondition: Function,
}

const ConditionTag = ({ name, removeCondition }: Props) => (
  <div
    className="conditionTag"
  >
    {name}
    <span // eslint-disable-line jsx-a11y/no-static-element-interactions
      className="conditionTag__removeButton"
      onClick={() => removeCondition(name)}
    >
      x
    </span>
  </div>
);

export default ConditionTag;
