// @flow

import React, { Component } from 'react';
import Form, { Button } from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';
import Spinner from 'components/Spinner';
import ValidationMessage from 'components/ValidationMessage';
import TextAreaField from 'components/TextAreaField';

const schema = yup.object({
  message: yup
    .string(),
});

type Props = {
  onSubmit: Function,
  isSubmiting: boolean,
  answerId: string,
  error?: string, // eslint-disable-line react/no-unused-prop-types
};

class ReplyForm extends Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      model: {
        message: '',
      },
    };
  }

  state: {
    model: Object,
  };

  componentWillReceiveProps(newProps: Props) {
    const { error } = newProps;
    const { isSubmiting } = this.props;
    if (isSubmiting && isSubmiting !== newProps.isSubmiting) {
      if (error === '') {
        toastr.success('', 'A reply created successfully!', '');
      } else {
        toastr.error('', newProps.error);
      }
    }
  }

  onChange = (model: Object) => {
    this.setState({ model });
  }

  props: Props
  render() {
    const { isSubmiting, onSubmit, answerId } = this.props;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={(e) => { onSubmit(e, answerId); }}
        className="replyForm row column mb-lg"
      >
        <div className="row mb-mx">
          <div className="medium-12">
            <TextAreaField
              className="accent"
              name="message"
              id="message"
            />
            <ValidationMessage for="message" />
          </div>
        </div>
        <div className="row">
          <div className="small-12 column">
            <Button
              className="button secondary float-right"
              type="submit"
            >{isSubmiting && <Spinner className="mr-sm" />}Submit</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default ReplyForm;
