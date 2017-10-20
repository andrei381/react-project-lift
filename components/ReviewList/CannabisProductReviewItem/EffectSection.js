// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { map } from 'lodash';
import EffectList from 'components/EffectList';
import TagList from 'components/TagList';

import './styles.scss';

type Props = {
  title: string,
  data: Array<Object>,
};

type State = {
  showDetail: boolean,
};

class EffectSection extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDetail: false,
    };
  }
  state: State
  props: Props
  render() {
    const { data, title } = this.props;
    if (!data || data.length === 0) {
      return null;
    }
    const names = map(data, (item) => item.name);
    return (
      <div className="row mb-md">
        <div className="column">
          <div className="mb-md fs-mx">
            <div className="row">
              <div className="column shrink">
                {title}
              </div>
              <div className="column">
                <Link onClick={() => this.setState({ showDetail: true })}>Show Breakdown</Link>
              </div>
            </div>
          </div>
          {
            this.state.showDetail ? <EffectList
              values={data}
              readOnly
            /> : <TagList
              values={names}
              readOnly
            />
          }
        </div>
      </div>
    );
  }
}

export default EffectSection;
