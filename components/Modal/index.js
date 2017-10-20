// @flow

import React, { Component } from 'react';
import ReactModal from 'react-modal';
import Button from 'components/Button';

type Props = {
  content?: any,
  title?: string,
  isOpen?: boolean,
  promptText?: string,
  linkText?: string,
  textIsButton?: boolean,
  unlockFunction?: Function,
};

class Modal extends Component {
  constructor(props: Object) {
    super();
    this.state = {
      isOpen: props.isOpen,
    };
  }
  state: Object
  props: Props
  closeModal() { this.setState({ isOpen: false }); }
  openModal() { this.setState({ isOpen: true }); }
  render() {
    const { content, title, promptText, linkText, textIsButton, unlockFunction } = this.props;
    const { isOpen } = this.state;
    const afterOpenFn = () => {};
    const setPrompt = () => {
      if (textIsButton) {
        return (
          <Button
            className="large secondary"
            onClick={() => this.openModal()}
          >{linkText}</Button>
        );
      }
      return <span>{promptText}&nbsp;<a onClick={() => this.openModal()}>{linkText}</a></span>; // eslint-disable-line jsx-a11y/no-static-element-interactions
    };
    return (<span>
      {setPrompt()}
      <ReactModal
        shouldCloseOnOverlayClick
        isOpen={isOpen}
        onAfterOpen={afterOpenFn}
        onRequestClose={() => this.closeModal()}
        closeTimeoutMS={0}
        className={'formModal__content small-12 columns'}
        overlayClassName={'formModal row-fluid'}
        contentLabel="formModal"
      >
        <h1 className="text-center">{title}</h1>
        <div
          className="mb-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        {unlockFunction && <Button
          onClick={() => unlockFunction()}
          className="large large-spacious secondary expanded mb-lg"
        >
          {linkText}
          </Button>}
        <Button
          onClick={() => this.closeModal()}
          className="large large-spacious dark shadow expanded mb-lg"
        >
              Close
          </Button>
      </ReactModal>
    </span>);
  }
}

export default Modal;
