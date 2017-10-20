// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List } from 'immutable';

import { setMetaJson } from 'containers/App/sagas';

import Icon from 'components/Icon';
import ChevronRight from 'images/sprite/chevron-right.svg';
import './styles.scss';

type Props = {
  path: List<Map<string, Object>>,
  setMetaJson: Function,
};

const Separator = () => (
  <div className="breadcrumbs__item">
    <Icon
      glyph={ChevronRight}
      width={10}
      height={10}
    />
  </div>
);
class Breadcrumbs extends Component {
  componentWillMount() {
    const props = this.props;
    const pathString = props.path ? props.path.toJS().map((item) => item.title).join(' > ') : '';
    this.props.setMetaJson(['breadcrumb'], pathString);
  }

  componentWillReceiveProps(newProps: Props) {
    const pathString = newProps.path.toJS().map((item) => item.title).join(' > ');
    this.props.setMetaJson(['breadcrumb'], pathString);
  }
  props: Props
  render() {
    const {
      path,
    } = this.props;
    let filteredPath = null;
    let lastIndex = null;
    if (path) {
      lastIndex = path.size - 1;
      filteredPath = path.entrySeq();
    }
    return (
      <div className="row column">
        {filteredPath &&
          <div className="breadcrumbs">
            <div
              key={0}
              className="breadcrumbs__group"
            >
              <div className="breadcrumbs__item">
                <Link
                  className="breadcrumbs__link"
                  to="/"
                >Home</Link>
              </div>
              <Separator />
            </div>
            {filteredPath.map(([key, value]) => (
              <div
                key={key + 1}
                className="breadcrumbs__group"
              >
                {key === lastIndex ?
                  <div className="breadcrumbs__item breadcrumbs__item--current">
                    {value.get('title')}
                  </div> :
                  <div>
                    <div className="breadcrumbs__item">
                      <Link
                        className="breadcrumbs__link"
                        to={value.get('link')}
                      >{value.get('title')}</Link>
                    </div>
                    <Separator />
                  </div>
                }
              </div>
            ))}
          </div>
        }
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(null, mapDispatchToProps)(Breadcrumbs);
