// @flow

import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { generate } from 'shortid';
import { fromJS } from 'immutable';

import BorderedTitle from 'components/BorderedTitle';
import Tab from 'components/Tab';
import ButtonGroup from 'components/ButtonGroup';
import Select from 'components/Select';

type Props = {
  params: Object,
  category: string,
  business: Object,
  setBreadcrumbPath: Function,
};

class BusinessAboutContainer extends Component {
  componentWillReceiveProps({ business }: Props) {
    if (business && business.get('id')) {
      this.setBreadcrumbPath(business);
    }
  }
  setBreadcrumbPath = (data: Object) => {
    const { category } = this.props;
    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const breadcrumbPath = fromJS([
      {
        link: '/find',
        title: 'Find',
      },
      {
        link: `/${categoryPlural}`,
        title: categoryPlural,
      },
      {
        link: '',
        title: (data ? data.get('name') : ''),
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  }
  props: Props
  render() {
    const {
      category,
      business,
      params,
    } = this.props;

    const categoryPlural = (category === 'dispensary' ? 'dispensaries' : `${category}s`);
    const baseUrl = `/${categoryPlural}/${params.slug}`;

    const title = 'About';
    const description = business.get('description');

    return (
      <div>
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={baseUrl}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          <Tab to={`${baseUrl}/comments`}>Comments</Tab>
          <Tab to={`${baseUrl}/products`}>Products</Tab>
        </ButtonGroup>
        <div className="row">
          <div className="column">
            <Select
              className="mb-lg show-for-small-only b-primary"
              value={''}
              onChange={(e) => {
                if (e.target.value === 'About') {
                  browserHistory.push(baseUrl);
                } else {
                  browserHistory.push(`${baseUrl}/${e.target.value.toLowerCase()}`);
                }
              }}
            >
              {['About', 'Reviews', 'Comments', 'Products'].map((item) => (
                <option
                  key={generate()}
                  value={item}
                >{item}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <BorderedTitle>{title}</BorderedTitle>
          </div>
        </div>
        <div className="row mb-lg fs-md">
          <div
            className="column"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    );
  }
}

export default BusinessAboutContainer;
