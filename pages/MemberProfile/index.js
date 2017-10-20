// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import { requestReviewsCount } from 'containers/MemberProfile/sagas';
import MemberProfile from 'components/MemberProfile';
import MemberProfileContainer from 'containers/MemberProfile';

import { setMetaJson } from 'containers/App/sagas';

type Props = {
  params: Object,
  profile: Map<string, string>,
  reviewsCount: string,
  helpfulReviewsCount: string,
  requestReviewsCount: Function,
  setMetaJson: Function,
};

class MemberProfilePage extends Component {
  componentWillReceiveProps({ profile, reviewsCount }) {
    if (profile && reviewsCount === null) {
      this.props.requestReviewsCount(profile.getIn(['hits', '0', 'id']));
    }
  }
  props: Props
  render() {
    const {
      params: { slug },
      profile,
      reviewsCount,
      helpfulReviewsCount,
    } = this.props;
    return (
      <MemberProfileContainer
        title="Profile"
        slug={slug}
        data={profile}
        setMetaJson={this.props.setMetaJson}
      >
        <MemberProfile
          data={profile}
          reviewsCount={reviewsCount}
          helpfulReviewsCount={helpfulReviewsCount}
        />
      </MemberProfileContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['memberProfile', 'profile', 'isLoading']),
  profile: state.getIn(['memberProfile', 'profile', 'data']),
  reviewsCount: state.getIn(['memberProfile', 'reviewsCount']),
  helpfulReviewsCount: state.getIn(['memberProfile', 'helpfulReviewsCount']),
});

const mapDispatchToProps = (dispatch) => ({
  requestReviewsCount: (userId) => dispatch(requestReviewsCount(userId)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberProfilePage);
