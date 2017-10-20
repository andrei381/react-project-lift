// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { openNavbar, closeNavbar } from 'containers/App/sagas';

import Header from 'components/Header';

type Props = {
  user: Object,
  replace: Function,
}

class HeaderContainer extends Component {
  componentWillReceiveProps({ user }: Props) {
    if (this.props.user && !user) {
      this.props.replace('/');
    }
  }
  props: Props
  render() {
    return <Header {...this.props} />;
  }
}

const mapStateToPtops = (state) => ({
  navbarOpen: state.getIn(['app', 'navbarOpen']),
});

const mapDispatchToProps = (dispatch) => ({
  openNavbar: () => dispatch(openNavbar()),
  closeNavbar: () => dispatch(closeNavbar()),
});

export default connect(mapStateToPtops, mapDispatchToProps)(HeaderContainer);
