// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import { requestFollowings } from 'containers/MemberProfile/sagas';
import MemberProfileContainer from 'containers/MemberProfile';
import Preloader from 'components/Preloader';
import ProductCard from 'components/ProductCard';
import Pagination from 'components/Pagination';

import { setMetaJson } from 'containers/App/sagas';

type Props = {
  params: Object,
  isLoading: boolean,
  followings: Map<string, any>,
  pages: number,
  profile: Map<string, string>,
  requestFollowings: Function,
  setMetaJson: Function,
};

class MemberProfileFollowing extends Component {
  componentWillReceiveProps({ profile, followings }) {
    if (profile && followings === null) {
      this.props.requestFollowings(profile.getIn(['hits', 0, '_id']));
    }
  }
  props: Props
  render() {
    const {
      params: { slug },
      followings,
      profile,
      isLoading,
      pages,
    } = this.props;
    return (
      <MemberProfileContainer
        title="Following"
        slug={slug}
        data={profile}
        setMetaJson={this.props.setMetaJson}
      >
        {isLoading ?
          <div className="text-center"><Preloader height={348} /></div> :
          <div className="productsList row align-stretch">
            {followings && followings.get('hits').entrySeq().map(([key, value]) => ( // see https://github.com/facebook/immutable-js/issues/667 for detailed description
              <div
                className="productsList__item small-12 medium-6 large-4 column"
                key={key}
              >
                <ProductCard data={value.get('item')} />
              </div>
            ))}
          </div>
        }
        <Pagination
          initialPage={1}
          pageCount={Math.ceil(pages)}
          onPageChange={(e) => this.props.requestFollowings(profile.getIn(['hits', 0, '_id']), ['model', 'page'], e)}
        />
      </MemberProfileContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.getIn(['memberProfile', 'followings', 'isLoading']),
  followings: state.getIn(['memberProfile', 'followings', 'data']),
  pages: state.getIn(['memberProfile', 'followings', 'data', 'pages']),
  profile: state.getIn(['memberProfile', 'profile', 'data']),
});

const mapDispatchToProps = (dispatch) => ({
  requestFollowings: (userId, path, value) => dispatch(requestFollowings(userId, path, value)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberProfileFollowing);
