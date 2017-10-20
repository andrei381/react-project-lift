// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';

type Props = {
  message: string,
}

type State = {
  showMore: boolean,
}
class EllipsisMessage extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }
  state: State
  props: Props
  render() {
    const { message } = this.props;
    let shortMsg = '';
    const messageTemplate = <div className="cannabisProductReviewItem__ellipsisMessage">{message}</div>;
    if (message.length > 400) {
      shortMsg = `${message.substr(0, 400)}...`;
    }
    if (shortMsg === '') return messageTemplate;
    return (
      <div>
        {
          this.state.showMore ? <div>
            {messageTemplate}
          </div> : <div>
            {shortMsg}
            <Link
              className="ml-mn"
              onClick={() => this.setState({ showMore: true })}
            >
              Show More
            </Link>
          </div>
        }
      </div>
    );
  }
}

export default EllipsisMessage;
