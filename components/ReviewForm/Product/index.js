// @flow

import React, { Component } from 'react';
import Form, { Field, Button } from 'react-formal';
import yup from 'yup';
import cx from 'classnames';

import RequireAuth from 'components/RequireAuth';
import Spinner from 'components/Spinner';
import RadioGroup from 'components/RadioGroup';
import ValidationMessage from 'components/ValidationMessage';
import TextAreaField from 'components/TextAreaField';
import StarRating from 'components/StarRating';

import './styles.scss';

const schema = yup.object({
  rating: yup
    .number()
    .min(0.5, 'must be rated.')
    .max(5),
  title: yup
    .string()
    .required()
    .max(150, 'maximum title length is 150 characters'),
  message: yup
    .string()
    .required()
    .min(50, 'minimum review length is 50 characters'),
  wouldPurchaseAgain: yup
    .boolean()
    .required(),
});

type Props = {
  submitReview: Function,
  isLoading: boolean,
  reviewId: string,
  error: string,
  reviewData: Object,
  currentUser: Object,
  productId: string,
  completeReviewForm: Function,
  clearReviewForm: Function,
};

class ProductReviewForm extends Component {
  constructor(props: Object) {
    super(props);
    const tempData = localStorage.getItem(props.productId);
    if (tempData) {
      this.state = {
        model: JSON.parse(tempData),
      };
      this.submitReview(JSON.parse(tempData));
      localStorage.removeItem(props.productId);
    } else {
      this.state = {
        model: {
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        showSecondaryTitle: false,
      };
    }
  }

  state: {
    model: Object,
    showSecondaryTitle: boolean,
  };


  componentWillMount() {
    const { reviewData, reviewId } = this.props;
    if (reviewId && reviewData.get('data')) {
      this.setState({
        model: {
          rating: reviewData.getIn(['data', 'rating']),
          title: reviewData.getIn(['data', 'title']),
          message: reviewData.getIn(['data', 'message']),
          wouldPurchaseAgain: reviewData.getIn(['data', 'wouldPurchaseAgain']),
        },
        showSecondaryTitle: false,
      });
    }
  }
  componentDidMount() {
    const { reviewData, reviewId } = this.props;
    if (reviewId && reviewData.get('data')) {
      this.props.completeReviewForm(['rating'], true);
      this.props.completeReviewForm(['title'], true);
      this.props.completeReviewForm(['message'], true);
    }
  }
  componentWillReceiveProps(newProps: Object) {
    const { reviewId } = this.props;

    if (newProps.review &&
      newProps.review.get('isLoading') === false &&
      newProps.review.get('error') !== '' &&
      !reviewId) {
      this.setState({
        model: {
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        showSecondaryTitle: false,
      });
    }
  }
  componentWillUnmount() {
    this.props.clearReviewForm();
  }
  onChange = (model: Object) => {
    this.setState({ model });
  }

  onChangeRate = (rate: Number) => {
    const { model } = this.state;
    model.rating = rate;
    this.props.completeReviewForm(['rating'], !!rate);
    this.onChange(model);
  }

  onChangePurchase = (value?: Boolean) => {
    const { model } = this.state;
    model.wouldPurchaseAgain = value;
    this.onChange(model);
  }

  onRedirect = () => {
    const { productId } = this.props;
    const postData = this.state.model;
    postData.product = productId;
    postData.url = window.location.pathname;
    localStorage.setItem(productId, JSON.stringify(postData));
  }

  submitReview = (data: Object) => {
    const { submitReview, productId, reviewId, currentUser } = this.props;
    const postData = data;
    postData.product = productId;
    postData.url = window.location.pathname;

    if (currentUser) {
      submitReview(postData, reviewId);
    }
  }

  props: Props
  render() {
    const { isLoading, error, currentUser } = this.props;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={this.submitReview}
        className="productReviewForm"
      >
        <div className="row mb-mx">
          <div className="column">
            <h5 className="t-capitalize">Review Product</h5>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column shrink">
            <div className="productReviewForm__ratingSection">
              <div className="row align-middle mb-sm">
                <div className="productReviewForm__ratingLabel column">Rating: </div>
                <div className="column align-left">
                  <StarRating
                    initialRate={this.state.model.rating}
                    readonly={false}
                    size={30}
                    onChange={(rate) => { this.onChangeRate(rate); }}
                    id="rating"
                  />
                  <ValidationMessage for="rating" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="title">Review Title</label>
            <Field
              className="accent"
              name="title"
              id="title"
              type="text"
              onChange={(value) => this.props.completeReviewForm(['title'], !!value)}
              onFocus={() => this.setState({ showSecondaryTitle: true })}
              onBlur={() => this.setState({ showSecondaryTitle: false })}
            />
            {
              this.state.showSecondaryTitle ?
                <div className="fs-md">A short summary of your review <span className={cx({ 'c-danger': this.state.model.title.length > 150 })}>{this.state.model.title.length}</span> /150 characters</div> :
                <ValidationMessage for="title" />
            }
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="message">Review Message</label>
            <TextAreaField
              className="accent"
              name="message"
              id="message"
              onChange={(value) => this.props.completeReviewForm(['message'], !!value)}
            />
            <ValidationMessage for="message" />
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="wouldPurchaseAgain">Would you purchase this product again?</label>
            <RadioGroup
              name="wouldPurchaseAgain"
              itemClassName="mr-md d-ib"
              options={[
                {
                  label: 'Yes',
                  value: true,
                },
                {
                  label: 'No',
                  value: false,
                },
              ]}
              value={this.state.model.wouldPurchaseAgain}
              onChange={this.onChangePurchase}
            />
          </div>
        </div>
        <div className="row">
          <div className="small-12 column mb-md">
            { currentUser ?
              <Button
                className="button secondary"
                type="submit"
              >{isLoading && <Spinner className="mr-sm" />}Submit</Button>
              :
              <RequireAuth
                toDo="create review"
                onClickLogin={this.onRedirect}
                onClickRegister={this.onRedirect}
              >
                <Button className="button secondary">Submit</Button>
              </RequireAuth>
            }
          </div>
        </div>
        <div className="small-12 column text-center c-danger">{error}</div>
      </Form>
    );
  }
}

export default ProductReviewForm;
