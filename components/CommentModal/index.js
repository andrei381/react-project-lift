// @flow

import React, { Component } from 'react';
import Form, { Button } from 'react-formal';
import yup from 'yup';

import ValidationMessage from 'components/ValidationMessage';
import Spinner from 'components/Spinner';
import TextAreaField from 'components/TextAreaField';
import FormModal from 'components/FormModal';
import './styles.scss';

const schema = yup.object({
  message: yup
    .string()
    .required(),
});

type Props = {
  topic: Object,
  url: string,
  commentId?: string,
  requestComment: Function,
  isLoading: boolean,
  error: string,
  linkText?: string,
  textIsButton?: boolean,
  linkStyle?: string,
};

class CommentModal extends Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      isModalOpen: false,
      model: {
        message: '',
      },
    };
  }
  state: {
    isModalOpen: boolean,
    model: Object,
  }

  componentWillReceiveProps(newProps: Object) {
    const { isLoading } = this.props;
    if (isLoading === true &&
      newProps.isLoading === false &&
      newProps.error === '') {
      this.onCloseModal();
    }
  }

  onCloseModal = () => {
    this.setState({
      model: { message: '' },
      isModalOpen: false,
    });
  }

  onOpenModal = () => {
    this.setState({ isModalOpen: true });
  }

  requestComment = (data: Object) => {
    const { topic, url, commentId } = this.props;
    const model = data;
    model.topic = topic;
    model.url = url;
    this.props.requestComment(model, commentId);
  }

  props: Props
  render() {
    const { isLoading, error, linkText, textIsButton, linkStyle } = this.props;
    return (
      <FormModal
        linkText={linkText || 'Comment Now'}
        textIsButton={textIsButton}
        title={'Leave a Comment™'}
        isOpen={this.state.isModalOpen}
        onCloseModal={this.onCloseModal}
        onOpenModal={this.onOpenModal}
        linkStyle={linkStyle}
      >
        <div className="commentModal">
          <Form
            schema={schema}
            value={this.state.model}
            onChange={(model) => this.setState({ model })}
            onSubmit={this.requestComment}
          >
            <div className="row">
              <div className="small-12 column mb-md">
                <div className="fs-mx mb-sm">Questions or comments?</div>
                <div className="fs-mn">Post them here and the community will respond.
                  You can @ mention other members of Lift to include them in the conversation.
                </div>
              </div>
              <div className="small-12 column">
                <div className="mb-lg">
                  <label htmlFor="comment">Your Comment *</label>
                  <TextAreaField
                    className="commentModal__commentField"
                    name="message"
                    id="message"
                  />
                  <ValidationMessage for="message" />
                </div>
              </div>
              <div className="small-12 column mb-md">
                <Button
                  className="button secondary spacious"
                  type="submit"
                >{isLoading && <Spinner className="mr-sm" />}Submit</Button>
              </div>
              <div className="small-12 column text-center c-danger">{this.state.model.message ? error : ''}</div>
            </div>
          </Form>
        </div>
      </FormModal>
    );
  }
}

export default CommentModal;
