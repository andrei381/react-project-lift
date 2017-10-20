// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import { requestReviews } from 'containers/MemberProfile/sagas';
import MemberReviews from 'components/MemberReviews';
import MemberProfileContainer from 'containers/MemberProfile';
import Preloader from 'components/Preloader';

import { setMetaJson } from 'containers/App/sagas';

type Props = {
  params: Object,
  isLoading: boolean,
  reviews: Map<string, string>,
  profile: Map<string, string>,
  requestReviews: Function,
  setMetaJson: Function,
};

class MemberProfileReviews extends Component {
  componentWillReceiveProps({ profile, reviews }) {
    if (profile && reviews === null) {
      this.props.requestReviews(profile.getIn(['hits', 0, '_id']));
    }
  }
  props: Props
  render() {
    const {
      params: { slug },
      reviews,
      profile,
      isLoading,
    } = this.props;
    return (
      <MemberProfileContainer
        title="Reviews"
        slug={slug}
        data={profile}
        setMetaJson={this.props.setMetaJson}
      >
        {isLoading ?
          <div className="text-center"><Preloader height={348} /></div> :
          <MemberReviews data={reviews} />
        }
      </MemberProfileContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['memberProfile', 'reviews', 'isLoading']),
  reviews: state.getIn(['memberProfile', 'reviews', 'data']),
  profile: state.getIn(['memberProfile', 'profile', 'data']),
});

const mapDispatchToProps = (dispatch) => ({
  requestReviews: (userId) => dispatch(requestReviews(userId)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberProfileReviews);
