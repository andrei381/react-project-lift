// @flow

import React from 'react';
import { Message } from 'react-formal';

import './styles.scss';

type Props = {
  for: string,
  customError?: string,
};

const ValidationMessage = (props: Props) =>
  <Message
    component="div"
    errorClass="validation"
    for={props.for}
  >
    {(messages) => {
      const errorMessage = props.customError ? props.customError : messages.join(', ');
      return (<div className="validation__error">
        Errors: {errorMessage}.
      </div>);
    }}
  </Message>;

export default ValidationMessage;
