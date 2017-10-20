// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from 'components/Button';
import cx from 'classnames';
import './styles.scss';

type Props = {
  data: Object,
  isMapView: boolean,
  category: string,
  className?: string,
  onClickViewOnMap: Function,
};

class BusinessItemDetail extends Component {
  onClickViewOnMap = () => {
    this.props.onClickViewOnMap(this.props.data);
  }
  props: Props
  render() {
    const { data, isMapView, category, className } = this.props;
    const email = data.get('email');
    const telephone = data.get('telephone');
    const website = data.get('website');
    const address = data.getIn(['locations', 0, 'address']);
    const city = data.getIn(['locations', 0, 'city']);
    const province = data.getIn(['locations', 0, 'province']);
    const postalCode = data.getIn(['locations', 0, 'postalCode']);

    const slug = data.get('slug');
    const containerClassName = cx('businessItemDetail', className);
    return (
      <div className={containerClassName}>
        {isMapView && <div className="row mb-lg fs-md text-left">
          <div className="small-12 columns">
            {address}
          </div>
          <div className="small-12 columns">
            {postalCode}
          </div>
          <div className="small-12 columns">
            {city}, {province}
          </div>
          <div className="small-12 columns">
            Canada
          </div>
        </div>}
        {!isMapView && <div className="row">
          <div className="small-12 columns text-left fs-md">
            {address}, {city}, {province}, {postalCode}, Canada
          </div>
        </div>}
        {isMapView && <div className="row mb-lg">
          <div className="small-12 columns text-left">
            <Link
              className="businessItemDetail__actionLink"
              to={`/${category}/${slug}`}
            >
              <Button
                element="button"
                className="secondary mr-mn"
              >View Profile</Button>
            </Link>
            <Button
              element="button"
              className="secondary mr-mn hide-for-small-only"
              onClick={this.onClickViewOnMap}
            >
              View On Map
            </Button>
          </div>
        </div>}
        <div className="row mb-lg">
          {telephone &&
            <div className={cx('columns text-left', (isMapView ? 'small-12' : 'shrink'))}>
              <a
                href={`tel:${telephone}`}
                className="t-lowercase"
              >
                {telephone}
              </a>
            </div>
          }
          {email &&
            <div className={cx('columns text-left', (isMapView ? 'small-12' : 'shrink'))}>
              <a
                href={`mailto:${email}`}
                className="t-lowercase"
              >
                {email}
              </a>
            </div>
          }
          {website &&
            <div className={cx('columns text-left', (isMapView ? 'small-12' : 'shrink'))}>
              <a
                href={website}
                className="t-lowercase"
              >
                {website}
              </a>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default BusinessItemDetail;
