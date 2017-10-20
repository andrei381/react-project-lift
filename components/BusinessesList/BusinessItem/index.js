// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';
import BusinessItemDetail from './BusinessItemDetail';
import './styles.scss';

type Props = {
  data: Object,
  isMapView: boolean,
  onClickViewOnMap: Function,
  category: string,
};

class BusinessItem extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      isToggled: false,
    };
  }
  state: {
    isToggled: boolean,
  }

  onToggleItem = () => {
    this.setState({ isToggled: !this.state.isToggled });
  }

  props: Props
  render() {
    const { data, isMapView, category } = this.props;
    const name = data.get('name');
    const slug = data.get('slug');
    const placeholderImg = 'https://liftcannabis.ca/uploads/f75cdf8fb58061d1baf329f0f746f580.png';
    const thumbnail = data.get('thumbnail') || placeholderImg;
    return (
      <div
        id={slug}
        className="businessItem mb-xl"
      >
        <div className="row mb-lg">
          <div className="shrink column">
            <Link
              className="businessItem__titleLink"
              to={`/${category}/${slug}`}
            >
              <div
                className="businessItem__image"
                style={{ backgroundImage: `url('https://images.lift.co/resize/70x70/${thumbnail}')` }}
              >
              </div>
            </Link>
          </div>
          <div className="column text-left">
            <Link
              className="businessItem__titleLink t-capitalize mb-lg"
              to={`/${category}/${slug}`}
            >
              <h4 className="businessItem__name">{name}</h4>
            </Link>
            <BusinessItemDetail
              isMapView={isMapView}
              className={(this.state.isToggled && !isMapView ? '' : 'hide')}
              data={data}
              category={category}
              onClickViewOnMap={this.props.onClickViewOnMap}
            />
          </div>
          {!isMapView && <div className="shrink column">
            <Link
              className="businessItem__actionLink"
              to={`/${category}/${slug}`}
            >
              <Button
                element="button"
                className="secondary"
              >View Profile</Button>
            </Link>
          </div>}
          <div className="shrink column">
            <Icon
              glyph={this.state.isToggled ? ChevronUp : ChevronDown}
              size={30}
              onClick={this.onToggleItem}
              className="businessItem__icon"
            />
          </div>
        </div>
        <BusinessItemDetail
          isMapView={isMapView}
          className={(this.state.isToggled && isMapView ? '' : 'hide')}
          data={data}
          category={category}
          onClickViewOnMap={this.props.onClickViewOnMap}
        />
      </div>

    );
  }
}

export default BusinessItem;
