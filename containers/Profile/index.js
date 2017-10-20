// @flow
import React, { Component } from 'react';
import Helmet from 'components/Helmet';

import ProfileEditFrom from 'components/ProfileEditForm';
import ProfileInfo from 'components/ProfileInfo';
import ProfileCompletion from 'components/ProfileCompletion';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  saveUserData: Function,
  uploadPhoto: Function,
  uploadedPhoto: string,
}

class ProfileContainer extends Component {
  props: Props
  render() {
    const { user, isLoading, error, saveUserData, uploadPhoto, uploadedPhoto } = this.props;
    return (
      <div>
        <Helmet title="My Profile" />
        <ProfileInfo
          user={user}
          reviewsCount={0}
          helpfulReviewsCount={0}
        />
        <div className="row column">
          <div className="bt-medium-gray mb-xxl" />
        </div>
        <div className="row">
          <div className="column">
            <ProfileEditFrom
              user={user}
              isLoading={isLoading}
              error={error}
              saveUserData={saveUserData}
              uploadPhoto={uploadPhoto}
              uploadedPhoto={uploadedPhoto}
            />
          </div>
          <div className="small-12 medium-shrink column">
            {
              user && <ProfileCompletion user={user} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileContainer;
