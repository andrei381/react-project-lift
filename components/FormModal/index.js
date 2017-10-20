// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactModal from 'react-modal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import IconClose from 'images/sprite/close.svg';
import './styles.scss';

type Props = {
  title?: string,
  isOpen?: boolean,
  promptText?: string,
  linkText?: string,
  textIsButton?: boolean,
  unlockFunction?: Function,
  onCloseModal?: Function,
  onOpenModal?: Function,
  linkStyle?: string,
  children?: any,
};

class FormModal extends Component {
  constructor(props: Object) {
    super();
    this.state = { isOpen: props.isOpen };
  }
  state: {
    isOpen: boolean,
  }
  componentWillReceiveProps(newProps: Object) {
    this.setState({ isOpen: newProps.isOpen });
  }

  openModal = () => {
    this.setState({ isOpen: true });
    if (this.props.onOpenModal) this.props.onOpenModal();
  }
  closeModal = () => {
    this.setState({ isOpen: false });
    if (this.props.onCloseModal) this.props.onCloseModal();
  }

  props: Props
  render() {
    const {
      title,
      promptText,
      linkText,
      linkStyle,
      textIsButton,
      unlockFunction,
    } = this.props;
    const afterOpenFn = () => {};
    const setPrompt = () => {
      if (textIsButton) {
        return (
          <Button
            className={linkStyle}
            onClick={() => this.openModal()}
          >{linkText}</Button>
        );
      }
      return (
        <span>
          {promptText}&nbsp;
          <Link
            className={linkStyle}
            onClick={() => this.openModal()}
          >{linkText}</Link>
        </span>
      );
    };
    return (
      <span>
        {setPrompt()}
        <ReactModal
          shouldCloseOnOverlayClick
          isOpen={this.state.isOpen}
          onAfterOpen={afterOpenFn}
          onRequestClose={() => this.closeModal()}
          closeTimeoutMS={0}
          className={'formModal__content small-12 columns'}
          overlayClassName={'formModal row-fluid'}
          contentLabel="formModal"
        >
          <Icon
            glyph={IconClose}
            size={16}
            className="formModal__closeButton"
            onClick={() => this.closeModal()}
          />
          <div className="row">
            <div className="small-12 columns">
              <h3 className="mb-md">{title}</h3>

              {this.props.children}

              {unlockFunction && <Button
                onClick={unlockFunction}
                className="large large-spacious secondary"
              >
                {linkText}
              </Button>}
            </div>
          </div>
        </ReactModal>
      </span>
    );
  }
}

export default FormModal;
