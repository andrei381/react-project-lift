// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setMetaJson } from 'containers/App/sagas';

type Props = {
  data: Object,
  metaJson: Object,
  setMetaJson: Function,
};


class MetaJson extends Component {
  componentWillMount() {
    const { data, metaJson } = this.props;
    Object.keys(data).forEach((key) => {
      if (!metaJson.get(key)) {
        this.props.setMetaJson([key], data[key]);
      }
    });
  }

  props: Props
  render() {
    const { metaJson } = this.props;
    return (
      <script type="application/ld+json">
        {JSON.stringify(metaJson.toJS())}
      </script>
    );
  }
}

const mapStateToProps = (state) => ({
  metaJson: state.getIn(['app', 'metaJson']),
});
const mapDispatchToProps = (dispatch) => ({
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MetaJson);

