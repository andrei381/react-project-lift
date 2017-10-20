// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { Link, browserHistory } from 'react-router';
import { generate } from 'shortid';

import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/Tab';
import BorderedTitle from 'components/BorderedTitle';
import Preloader from 'components/Preloader';
import ProductsList from 'components/ProductsList';
import Select from 'components/Select';

import { requestOtherProducts, setBreadcrumbPath } from 'containers/Product/sagas';

type Props = {
  params: Object,
  data: Object,
  otherData: Object,
  otherIsLoading: boolean,
  business: string,
  setBreadcrumbPath: Function,
  requestOtherProducts: Function,
};

class ProductAboutPage extends Component {
  componentWillMount() {
    const { data, business } = this.props;
    if (data) {
      this.setBreadcrumbPath(data);
    }
    if (data && (data.getIn(['business', 'id']) !== business)) {
      this.props.requestOtherProducts(data.getIn(['business', 'id']));
    }
  }
  componentWillReceiveProps({ data, business, otherIsLoading }) {
    if (data && (data.getIn(['business', 'id']) !== business)) {
      this.props.requestOtherProducts(data.getIn(['business', 'id']));
    }
    const wasLoadingOtherProducts = this.props.otherIsLoading;
    if (data && wasLoadingOtherProducts && !otherIsLoading) {
      this.setBreadcrumbPath(data);
    }
  }
  setBreadcrumbPath = (data: Object) => {
    const category = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const breadcrumbPath = fromJS([
      {
        link: '/shop',
        title: 'Shop',
      },
      {
        link: `/${category}s`,
        title: `${category}s`,
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
      data,
      otherData,
      otherIsLoading,
    } = this.props;
    const category = data && data.get('__t') ? data.get('__t').toLowerCase() : 'product';
    const baseUrl = `/${category}s/${this.props.params.slug}`;
    return (
      <div className="mb-xl">
        <ButtonGroup
          className="centered mb-lg hide-for-small-only"
        >
          <Tab to={baseUrl}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          <Tab to={`${baseUrl}/comments`}>Comments</Tab>
        </ButtonGroup>
        <Select
          className="mb-lg show-for-small-only b-primary"
          value={''}
          onChange={(e) => browserHistory.push(`${baseUrl}/${e.target.value.toLowerCase()}`)}
        >
          {['About', 'Reviews', 'Comments'].map((item) => (
            <option
              key={generate()}
              value={item}
            >{item}</option>
          ))}
        </Select>
        <BorderedTitle>About</BorderedTitle>
        {data && data.get('description') ?
          <section
            className="t-columns mb-xl"
            dangerouslySetInnerHTML={{ __html: data && data.get('description') }}
          />
          :
          <section className="fs-base mb-xl">
            This producer has yet to submit a product description.&nbsp;
            <Link
              className="fs-base t-nt"
              to={`mailto:${data && data.getIn(['business', 'email'])}`}
              target="_top"
            >Email</Link> them and let them know!
          </section>
        }
        { otherIsLoading ?
          <div className="text-center"><Preloader height={200} /></div> :
          <div>
            { otherData && <div>
              <BorderedTitle element="h3">Other products you might like</BorderedTitle>
              <ProductsList data={otherData} />
            </div>
            }
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.getIn(['product', 'data', 'hits', 0]),
  otherData: state.getIn(['product', 'other', 'data', 'hits']),
  otherIsLoading: state.getIn(['product', 'other', 'isLoading']),
  business: state.getIn(['product', 'business']),
});

const mapDispatchToProps = (dispatch) => ({
  requestOtherProducts: (business) => dispatch(requestOtherProducts(business)),
  setBreadcrumbPath: (path) => dispatch(setBreadcrumbPath(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductAboutPage);
