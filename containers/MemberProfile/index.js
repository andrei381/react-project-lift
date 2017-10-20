// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';

import Helmet from 'components/Helmet';
import Breadcrumbs from 'components/Breadcrumbs';
import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/Tab';
import BorderedTitle from 'components/BorderedTitle';
import Preloader from 'components/Preloader';

import { requestMemberProfile } from './sagas';

type Props = {
  title: string,
  children?: React$Element<any>,
  slug: string,
  requestMemberProfile: Function,
  data: Map<string, string>,
  setMetaJson: Function,
};

class MemberProfileContainer extends Component {
  componentWillMount() {
    this.props.requestMemberProfile(this.props.slug);
  }
  componentWillReceiveProps({ data }: Props) {
    let userMetaJson = {};

    if (data && data.size > 0) {
      userMetaJson = {
        '@type': 'Person',
        birthDate: data.getIn(['hits', '0', 'birthday']),
        givenName: data.getIn(['hits', '0', 'firstName']),
        familyName: data.getIn(['hits', '0', 'lastName']),
        gender: data.getIn(['hits', '0', 'gender']),
        image: data.getIn(['hits', '0', 'picture']),
        description: data.getIn(['hits', '0', 'bio']),
        address: {
          '@type': 'PostalAddress',
          addressLocality: data.getIn(['hits', '0', 'city']),
          addressRegion: data.getIn(['hits', '0', 'province']),
          postalCode: data.getIn(['hits', '0', 'postalCode']),
          streetAddress: data.getIn(['hits', '0', 'fullLocation']),
        },
      };
      this.props.setMetaJson(['mainEntity'], userMetaJson);
    }
  }
  props: Props
  render() {
    const { title, children, slug, data } = this.props;
    const pathname = `/members/${slug}`;
    if (data && data.get('count') === 0) {
      return (
        <div className="row column mb-xl"><h3>User not found</h3></div>
      );
    }
    const breadcrumbPath = [
      {
        link: '/members',
        title: 'Members',
      },
    ];
    if (title === 'Profile') {
      breadcrumbPath.push({
        link: '',
        title: slug,
      });
    } else {
      breadcrumbPath.push({
        link: `/members/${slug}`,
        title: slug,
      });
      breadcrumbPath.push({
        link: '',
        title,
      });
    }
    return (
      <div>
        <Helmet title={title} />
        <Breadcrumbs
          path={fromJS(breadcrumbPath)}
        />
        <div className="row column">
          <h1 className="c-secondary mb-lg">
            {data && data.getIn(['hits', '0', 'username'])}
          </h1>
          <ButtonGroup className="air expanded mb-xl">
            <Tab to={pathname}>Profile</Tab>
            <Tab to={`${pathname}/following`}>Following</Tab>
            <Tab to={`${pathname}/reviews`}>Reviews</Tab>
          </ButtonGroup>
          <BorderedTitle>{title}</BorderedTitle>
          {data ?
            children :
            <div className="text-center"><Preloader height={375} /></div>
          }
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  requestMemberProfile: (slug) => dispatch(requestMemberProfile(slug)),
});

export default connect(null, mapDispatchToProps)(MemberProfileContainer);
