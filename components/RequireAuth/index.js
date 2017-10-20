// @flow

import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';

import Message from './Message';

type Props = {
  toDo: string,
  onClickLogin?: Function,
  onClickRegister?: Function,
  children?: React$Element<any>,
}

class RequireAuth extends Component {
  props: Props
  render() {
    const { toDo } = this.props;
    const toastrOptions = {
      timeOut: 0,
      component: (
        <Message
          toDo={toDo}
          onClickLogin={this.props.onClickLogin}
          onClickRegister={this.props.onClickRegister}
        />
      ),
    };
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        onClick={() => toastr.info('', '', toastrOptions)}
      >
        {this.props.children}
      </div>
    );
  }
}

export default RequireAuth;

