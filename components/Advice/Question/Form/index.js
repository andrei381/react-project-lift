// @flow

import React, { Component } from 'react';
import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';
import type { List } from 'immutable';

import CustomSelect from 'components/CustomSelect';
import Spinner from 'components/Spinner';
import ValidationMessage from 'components/ValidationMessage';
import transformOptions from 'utils/transformOptions';
import './styles.scss';

const schema = yup.object({
  title: yup
    .string()
    .min(16, 'minimal title length is 16 characters')
    .max(150, 'max title length is 150 characters')
    .required(),
  category: yup
    .string()
    .required(),
  description: yup
    .string(),
  tags: yup
    .string(),
});

type Props = {
  onSubmit: Function,
  isSubmiting: boolean,
  categories: List<*>,
  error: string, // eslint-disable-line react/no-unused-prop-types
  title: ?string,
};

class AnswerFrom extends Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        title: props.title,
        category: '',
        description: '',
        tags: '',
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
      if (!error) {
        toastr.success('', 'A question created successfully!', '');
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
    const { isSubmiting, onSubmit, categories } = this.props;
    const { model: { title } } = this.state;
    return (
      <Form
        className="createQuestionForm"
        schema={schema}
        value={this.state.model}
        onChange={(model) => this.setState({ model })}
        onSubmit={onSubmit}
      >
        <div className="row column mb-hg">
          <div className="row column">
            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-lg">
                <div className="mb-lg">Your question in one sentence (max 150 characters)*</div>
                <label htmlFor="title">{title ? title.length : 0}/150</label>
                <Field
                  className="accent"
                  name="title"
                  id="title"
                  type="text"
                />
                <ValidationMessage for="title" />
              </div>
            </div>

            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-lg">
                <div className="mb-lg">Select a Category*</div>
                <CustomSelect
                  className="large"
                  value={this.state.model.category}
                  clearable={false}
                  options={transformOptions(categories.toJS(), false, '_id')}
                  name="category"
                  id="category"
                  onChange={(e) => {
                    this.setState({
                      model: {
                        ...this.state.model,
                        category: e.value,
                      },
                    });
                  }}
                />
                <ValidationMessage for="category" />
              </div>
            </div>

            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-lg">
                <div className="mb-lg">More information for your question (optional)</div>
                <Field
                  className="createQuestionForm__field__descriptionInput accent"
                  name="description"
                  id="description"
                  type="textarea"
                  rows="6"
                />
                <ValidationMessage for="description" />
              </div>
            </div>

            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-xl">
                <div className="mb-lg">Add any tags to help better categorize your question (optional)</div>
                <label htmlFor="title">multiple tags separated by commas</label>
                <Field
                  className="accent"
                  name="tags"
                  id="tags"
                  type="text"
                />
                <ValidationMessage for="tags" />
              </div>
              <div className="row column fs-mn">
                You will be notified by email when someone responds with an answer.
              </div>
              <div className="row column fs-mn mb-xl">
                You may then choose to mark the answer as correct and close the question.
              </div>
            </div>
          </div>
          <div className="shrink column">
            <Button
              className="button secondary spacious"
              type="submit"
            >{isSubmiting && <Spinner className="mr-sm" />}Submit</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default AnswerFrom;
