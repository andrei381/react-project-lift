// @flow

import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { geolocated } from 'react-geolocated';
import type { Map } from 'immutable';
import { Map as LMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';

import classNames from 'classnames';
import Icon from 'components/Icon';
import IconMap from 'images/sprite/map.svg';
import IconThList from 'images/sprite/th-list.svg';
import { DEFAULT_LAT, DEFAULT_LONG } from 'containers/constants';
import 'leaflet/dist/leaflet.css';
import BusinessItem from './BusinessItem';
import './styles.scss';

type Props = {
  data: Map<string, Object>,
  province: Map<string, Object>,
  category: string,
  total: number,
  show: number,
  page: number,
  coords: Object,
  isGeolocationAvailable: boolean, // boolean flag indicating that the browser supports the Geolocation API
  isGeolocationEnabled: boolean, // boolean flag indicating that the user has allowed the use of the Geolocation API
  positionError: Object,
};

class BusinessesList extends Component {
  constructor(props: Props) {
    super(props);
    const center = props.province.get('center');
    this.state = {
      centerLocation: [center.get('lat'), center.get('lng')],
      userLocation: [DEFAULT_LAT, DEFAULT_LONG],
      isMapFixedScroll: false,
      fixedMapScrollWidth: 0,
      isMapFixedBottom: false,
      isMapView: true,
      mapZoom: center.get('zoom'),
    };
  }

  state: {
    centerLocation: Array<number>,
    userLocation: Array<number>,
    isMapFixedScroll: boolean,
    fixedMapScrollWidth: number,
    isMapFixedBottom: boolean,
    isMapView: boolean,
    mapZoom: number,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.dispatchEvent(new Event('resize'));
  }

  componentWillReceiveProps(newProps) {
    const { coords, isGeolocationEnabled, isGeolocationAvailable, positionError, province } = this.props;
    const detectedGeoLocation = !coords && newProps.coords && !newProps.positionError;

    if (isGeolocationEnabled &&
      isGeolocationAvailable &&
      !positionError &&
      detectedGeoLocation
    ) {
      this.setState({
        userLocation: [
          newProps.coords.latitude,
          newProps.coords.longitude,
        ],
      });
      if (province.get('value') === '') {
        this.setState({
          centerLocation: [
            newProps.coords.latitude,
            newProps.coords.longitude,
          ],
          mapZoom: 8,
        });
      }
      window.dispatchEvent(new Event('resize'));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onClickViewOnMap = (data: Object) => {
    const latitude = data.getIn(['locations', 0, 'latitude']);
    const longitude = data.getIn(['locations', 0, 'longitude']);

    if (longitude && latitude) {
      this.mapElement.refs[data.get('id')].leafletElement.openPopup();
      this.setState({
        centerLocation: [
          latitude,
          longitude,
        ],
        mapZoom: 8,
      });
      window.dispatchEvent(new Event('resize'));
    }
  }

  onMapViewClick = () => {
    this.setState({ isMapView: true });
  }

  onListViewClick = () => {
    this.setState({ isMapView: false });
  }

  handleScroll = (event: Object) => {
    const { data } = this.props;
    if (!data || data.size === 0) {
      return;
    }
    if (!this.state.isMapView) {
      return;
    }
    const scrollTop = event.target.scrollingElement.scrollTop;
    if (scrollTop > ((this.fixedMapContainer.clientHeight + this.fixedMapContainer.offsetTop) - 540)) {
      this.setState({
        isMapFixedScroll: false,
        fixedMapScrollWidth: 0,
        isMapFixedBottom: true,
      });
    } else if (scrollTop > (this.fixedMapContainer.offsetTop)) {
      this.setState({
        isMapFixedScroll: true,
        fixedMapScrollWidth: this.fixedMapContainer.clientWidth - 30,
        isMapFixedBottom: false,
      });
    } else {
      this.setState({
        isMapFixedScroll: false,
        fixedMapScrollWidth: 0,
        isMapFixedBottom: false,
      });
    }
  }

  mapElement: Object
  mapContainer: Object
  fixedMapContainer: Object
  props: Props
  render() {
    const { data, province, category, total, show, page } = this.props;
    const provinceValue = province.get('value');
    const rangeFrom = ((page - 1) * show) + 1;
    const rangeTo = page * show;
    let filteredData = null;
    if (data) {
      if (provinceValue !== '') {
        filteredData = data.entrySeq().filter((item) => item[1].getIn(['locations', 0, 'province']) === provinceValue);
      } else {
        filteredData = data.entrySeq();
      }
    }
    if (!data || (data && data.size === 0)) {
      return (
        <div className="businessesList">
          <div className="text-center row mb-lg">
            <div className="column">
              Sorry no businesses found in this province.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="businessesList">
        <div className="text-center row mb-lg">
          <div className="shrink column">
            Showing {rangeFrom} - {rangeTo} of {total}
          </div>
          <div className="column" />
          <div className="shrink column align-right">
            <Icon
              onClick={this.onMapViewClick}
              className={classNames(
                'businessesList__viewIcon mr-lg',
                (this.state.isMapView ? 'businessesList__viewIcon--active' : ''),
              )}
              glyph={IconMap}
              size={16}
            />
            <Icon
              glyph={IconThList}
              size={16}
              className={classNames(
                'businessesList__viewIcon mr-lg',
                (!this.state.isMapView ? 'businessesList__viewIcon--active' : ''),
              )}
              onClick={this.onListViewClick}
            />
          </div>
        </div>
        <div className="text-center row">
          <div className={classNames('small-12 column', (this.state.isMapView ? 'large-4' : 'large-12'))}>
            <div className="businessesList__list small-12">
              {filteredData && filteredData.map(([key, value]) => (
                <BusinessItem
                  data={value}
                  key={key}
                  isMapView={this.state.isMapView}
                  onClickViewOnMap={this.onClickViewOnMap}
                  category={category}
                />
              ))}
            </div>
          </div>

          {this.state.isMapView &&
          <div
            className="small-12 large-8 column"
            style={{ position: 'relative' }}
            ref={(fixedMapContainer) => { this.fixedMapContainer = fixedMapContainer; }}
          >
            <div
              className={classNames(
                (this.state.isMapFixedBottom ? 'businessesList__mapWrapBottomFixed' : ''),
                (this.state.isMapFixedScroll ? 'businessesList__mapScrollWrapFixed' : ''),
              )}
              ref={(mapContainer) => {
                this.mapContainer = mapContainer;
              }}
              style={{ width: (this.state.fixedMapScrollWidth || '100%') }}
            >
              <LMap
                center={this.state.centerLocation}
                zoom={this.state.mapZoom}
                ref={(mapElement) => { this.mapElement = mapElement; }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={this.state.userLocation}
                  icon={divIcon({
                    className: 'businessList__iconUserLocation',
                    iconSize: [20, 20],
                    html: '<svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle fill="#0a78b3" cx="50" cy="50" r="50"/></svg>',
                  })}
                >
                  <Popup>
                    <div>Current Location</div>
                  </Popup>
                </Marker>
                {filteredData && filteredData.map(([key, value]) => { // see https://github.com/facebook/immutable-js/issues/667 for detailed description
                  const longitude = value.getIn(['locations', 0, 'longitude']) || DEFAULT_LAT;
                  const latitude = value.getIn(['locations', 0, 'latitude']) || DEFAULT_LONG;
                  const slug = value.get('slug').toString();
                  return (
                    <Marker
                      position={[
                        latitude,
                        longitude,
                      ]}
                      key={key}
                    >
                      <Popup>
                        <div>
                          <h4>{value.get('name')}</h4>
                          {value.get('telephone') &&
                            <div className="mb-sm">
                              {value.get('telephone')}
                            </div>
                          }
                          {value.get('address') &&
                            <div className="mb-sm">
                              {value.get('address')}
                            </div>
                          }
                          {value.get('website') &&
                            <div className="mb-sm">
                              {value.get('website')}
                            </div>
                          }
                          <a // eslint-disable-line jsx-a11y/no-static-element-interactions
                            onClick={() => browserHistory.push(`/${category}/${slug}`)}
                          >View Full Profile</a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </LMap>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(BusinessesList);
