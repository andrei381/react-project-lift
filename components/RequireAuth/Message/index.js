// @flow

import React from 'react';
import { browserHistory } from 'react-router';

type Props = {
  toDo: string,
  onClickLogin?: Function,
  onClickRegister?: Function,
}
const Message = ({ toDo, onClickLogin, onClickRegister }: Props) => (
  <div>
    You must <a // eslint-disable-line jsx-a11y/no-static-element-interactions
      onClick={() => {
        if (onClickLogin !== undefined) onClickLogin();
        browserHistory.push('/login');
      }}
    >Sign In</a> or
    <a // eslint-disable-line jsx-a11y/no-static-element-interactions
      onClick={() => {
        if (onClickRegister !== undefined) onClickRegister();
        browserHistory.push('/register');
      }}
    >Sign Up</a> to {toDo}.
  </div>
);

export default Message;
