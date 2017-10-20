// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS, List } from 'immutable';
import { browserHistory } from 'react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { EventTypes } from 'redux-segment';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'containers/constants';
import type { Action, State } from 'types/common';
import deepReplace from 'utils/deepReplace';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const PRODUCT = 'Lift/Product/PRODUCT';
const OTHER_PRODUCTS = 'Lift/Product/OTHER_PRODUCTS';
const COMMENTS = 'Lift/Product/COMMENTS';
const SUBMIT_COMMENT = 'Lift/Product/SUBMIT_COMMENT';
const DELETE_COMMENT = 'Lift/Product/DELETE_COMMENT';
const SORT_COMMENT = 'Lift/Product/SORT_COMMENT';
const SUBMIT_REVIEW = 'Lift/Product/SUBMIT_REVIEW';
const DELETE_REVIEW = 'Lift/Product/DELETE_REVIEW';
const REVIEWS = 'Lift/Product/REVIEWS';
const REVIEW = 'Lift/Product/REVIEW';
const VOTE_REVIEW = 'Lift/Product/VOTE_REVIEW';
const SORT_REVIEW = 'Lift/Product/SORT_REVIEW';
const SET_BREADCRUMB_PATH = 'Lift/Product/SET_BREADCRUMB_PATH';
const COMPLETE_REVIEW_FORM = 'Lift/Profile/COMPLETE_REVIEW_FORM';
const CLEAR_REVIEW_FORM = 'Lift/Profile/CLEAR_REVIEW_FORM';
const FOLLOW_LIKE_PRODUCT = 'Lift/Product/FOLLOW_LIKE_PRODUCT';
const FOLLOWS = 'Lift/Product/FOLLOWS';
const LIKES = 'Lift/Product/LIKES';
const PURCHASE_BUTTON = 'Lift/Product/PURCHASE_BUTTON';
// ------------------------------------
// Actions
// ------------------------------------
export const requestProduct = (slug: string) => ({
  type: PRODUCT + REQUESTED,
  payload: slug,
});
const productRequestSuccess = (payload: Object) => ({
  type: PRODUCT + SUCCEDED,
  payload,
});
const productRequestFailed = (error) => ({
  type: PRODUCT + FAILED,
  payload: error,
});
const productRequestError = (error) => ({
  type: PRODUCT + ERROR,
  payload: error,
});

export const requestProductReviews = (id: string, path: string, value: ?Object) => (
  {
    type: REVIEWS + REQUESTED,
    payload: value,
    meta: {
      id,
      path,
    },
  }
);
const productReviewsRequestSuccess = (id: string, data: Object) => ({
  type: REVIEWS + SUCCEDED,
  payload: data,
  meta: { id },
});
const productReviewsRequestFailed = (id: string, error: string) => ({
  type: REVIEWS + FAILED,
  payload: error,
  meta: { id },
});

export const requestOtherProducts = (business: string) => ({
  type: OTHER_PRODUCTS + REQUESTED,
  payload: business,
});
const otherProductsRequestSuccess = (payload: Object) => ({
  type: OTHER_PRODUCTS + SUCCEDED,
  payload,
});
const otherProductsRequestFailed = (error) => ({
  type: OTHER_PRODUCTS + FAILED,
  payload: error,
});
const otherProductsRequestError = (error) => ({
  type: OTHER_PRODUCTS + ERROR,
  payload: error,
});

export const requestComments = (id: string, path: string, value: ?Object) => ({
  type: COMMENTS + REQUESTED,
  payload: value,
  meta: {
    id,
    path,
  },
});
const commentsRequestSuccess = (payload: Object) => ({
  type: COMMENTS + SUCCEDED,
  payload,
});
const commentsRequestFailed = (error) => ({
  type: COMMENTS + FAILED,
  payload: error,
});
const commentsRequestError = (error) => ({
  type: COMMENTS + ERROR,
  payload: error,
});

export const submitComment = (payload: Object, commentId: string) => ({
  type: SUBMIT_COMMENT + REQUESTED,
  payload,
  commentId,
});
const commentSubmitSuccess = (payload: Object) => ({
  type: SUBMIT_COMMENT + SUCCEDED,
  payload,
  meta: {
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        event: 'product-comment-created',
        properties: {
          comment: payload.data,
        },
      },
    },
  },
});
const commentSubmitError = (error) => ({
  type: SUBMIT_COMMENT + ERROR,
  payload: error,
});

export const deleteComment = (commentId: string) => ({
  type: DELETE_COMMENT + REQUESTED,
  commentId,
});
const commentDeleteSuccess = (commentId: string) => ({
  type: DELETE_COMMENT + SUCCEDED,
  commentId,
});
const commentDeleteError = (error) => ({
  type: DELETE_COMMENT + ERROR,
  payload: error,
});

export const sortComment = (sortBy: string) => ({
  type: SORT_COMMENT,
  payload: sortBy,
});

export const submitReview = (payload: Object, reviewId: string) => ({
  type: SUBMIT_REVIEW + REQUESTED,
  payload,
  reviewId,
});
const reviewSubmitSuccess = (payload: Object) => ({
  type: SUBMIT_REVIEW + SUCCEDED,
  payload,
  meta: {
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        event: 'product-review-created',
        properties: {
          review: payload.data,
        },
      },
    },
  },
});
const reviewSubmitError = (error) => ({
  type: SUBMIT_REVIEW + ERROR,
  payload: error,
});

export const deleteReview = (reviewId: string) => ({
  type: DELETE_REVIEW + REQUESTED,
  reviewId,
});
const reviewDeleteSuccess = () => ({
  type: DELETE_REVIEW + SUCCEDED,
});
const reviewDeleteError = (error) => ({
  type: DELETE_REVIEW + ERROR,
  payload: error,
});

export const requestReview = (id: string) => ({
  type: REVIEW + REQUESTED,
  id,
});
const reviewRequestSuccess = (data: Object) => ({
  type: REVIEW + SUCCEDED,
  payload: data,
});
const reviewRequestFailed = (error: string) => ({
  type: REVIEW + FAILED,
  payload: error,
});

export const voteReview = (reviewId: string, type: string) => ({
  type: VOTE_REVIEW + REQUESTED,
  reviewId,
  meta: { type },
});
const reviewVoteSuccess = (reviewId: string) => ({
  type: VOTE_REVIEW + SUCCEDED,
  reviewId,
});
const reviewVoteError = (error) => ({
  type: VOTE_REVIEW + ERROR,
  payload: error,
});

export const sortReview = (sortBy: string) => ({
  type: SORT_REVIEW,
  payload: sortBy,
});

export const setBreadcrumbPath = (path: List<Map<string, Object>>) => ({
  type: SET_BREADCRUMB_PATH,
  payload: path,
});

export const completeReviewForm = (path: string, value: boolean) => ({
  type: COMPLETE_REVIEW_FORM,
  payload: value,
  meta: { path },
});

export const clearReviewForm = () => ({
  type: CLEAR_REVIEW_FORM,
});

export const followLikeProduct = (productId: string, actionType: string) => ({
  type: FOLLOW_LIKE_PRODUCT + REQUESTED,
  productId,
  actionType,
});
const productFollowLikeSuccess = () => ({
  type: FOLLOW_LIKE_PRODUCT + SUCCEDED,
});
const productFollowLikeError = (error) => ({
  type: FOLLOW_LIKE_PRODUCT + ERROR,
  payload: error,
});

export const requestProductFollows = (id: string) => ({
  type: FOLLOWS + REQUESTED,
  payload: id,
});
const productFollowsRequestSuccess = (count: number) => ({
  type: FOLLOWS + SUCCEDED,
  payload: count,
});
const productFollowsRequestFailed = (error) => ({
  type: FOLLOWS + FAILED,
  payload: error,
});

export const requestProductLikes = (id: string) => ({
  type: LIKES + REQUESTED,
  payload: id,
});
const productLikesRequestSuccess = (count: number) => ({
  type: LIKES + SUCCEDED,
  payload: count,
});
const productLikesRequestFailed = (error) => ({
  type: LIKES + FAILED,
  payload: error,
});

export const trackPurchaseButton = (business: string, product: string) => ({
  type: PURCHASE_BUTTON,
  meta: {
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        event: 'purchase-button',
        properties: {
          business,
          product,
        },
      },
    },
  },
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  data: null,
  isLoading: false,
  error: '',
  business: null,
  slug: null,
  other: {
    data: null,
    isLoading: false,
    error: '',
  },
  breadcrumbPath: null,
  id: null,
  comments: {
    data: {
      hits: {},
    },
    model: {
      page: 1,
      per_page: 10,
      sortBy: '-createdOn',
    },
    isLoading: false,
    error: '',
  },
  comment: {
    isLoading: false,
    error: '',
  },
  reviews: {
    data: {
      hits: {},
    },
    model: {
      page: 1,
      per_page: 10,
      sortBy: '-rating',
    },
    isLoading: false,
    error: '',
  },
  review: {
    isLoading: false,
    error: '',
  },
  reviewData: {
    isLoading: false,
    error: '',
    data: {},
  },
  reviewVote: {
    isLoading: false,
    error: '',
  },
  reviewCompletion: {
    rating: false,
    title: false,
    message: false,
  },
  productFollowLike: {
    isLoading: false,
    error: '',
  },
  follows: {
    count: 0,
    isLoading: false,
    error: '',
  },
  likes: {
    count: 0,
    isLoading: false,
    error: '',
  },
});

let newState = {};

export const reducer = (state: State = initialState, { type, payload, meta }: Action) => {
  switch (type) {
    case PRODUCT + REQUESTED:
      return state
        .set('isLoading', true)
        .set('slug', payload)
        .set('data', null);

    case PRODUCT + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('data', fromJS(payload))
        .set('error', '');

    case PRODUCT + FAILED:
      return state
        .set('isLoading', false)
        .set('error', payload);

    case PRODUCT + ERROR:
      return state
        .set('isLoading', false)
        .set('error', payload);

    case REVIEWS + REQUESTED:
      newState = state.setIn(['reviews', 'isLoading'], true);
      if (meta.path) return newState.setIn(['reviews', 'model', ...meta.path], fromJS(payload));
      return newState;

    case REVIEWS + SUCCEDED:
      return state
        .setIn(['reviews', 'isLoading'], false)
        .setIn(['reviews', 'data'], fromJS(payload.data));

    case REVIEWS + FAILED:
      return state
        .setIn(['reviews', 'isLoading'], false);

    case OTHER_PRODUCTS + REQUESTED:
      return state
        .setIn(['other', 'isLoading'], true)
        .set('business', payload);

    case OTHER_PRODUCTS + SUCCEDED:
      return state
        .setIn(['other', 'isLoading'], false)
        .setIn(['other', 'data'], fromJS(payload))
        .setIn(['other', 'error'], '');

    case OTHER_PRODUCTS + FAILED:
      return state
        .setIn(['other', 'isLoading'], false)
        .setIn(['other', 'error'], payload);

    case OTHER_PRODUCTS + ERROR:
      return state
        .setIn(['other', 'isLoading'], false)
        .setIn(['other', 'error'], payload);

    case COMMENTS + REQUESTED:
      newState = state.setIn(['comments', 'isLoading'], true)
        .set('id', meta.id);
      if (meta.path) return newState.setIn(['comments', 'model', ...meta.path], fromJS(payload));
      return newState;

    case COMMENTS + SUCCEDED:
      return state
        .setIn(['comments', 'isLoading'], false)
        .setIn(['comments', 'data'], fromJS(payload))
        .setIn(['comments', 'error'], '');

    case COMMENTS + FAILED:
      return state
        .setIn(['comments', 'isLoading'], false)
        .setIn(['comments', 'error'], payload);

    case COMMENTS + ERROR:
      return state
        .setIn(['comments', 'isLoading'], false)
        .setIn(['comments', 'error'], payload);

    case SUBMIT_COMMENT + REQUESTED:
      return state
        .setIn(['comment', 'isLoading'], true)
        .setIn(['comment', 'error'], '');

    case SUBMIT_COMMENT + SUCCEDED:
      return state
        .setIn(['comment', 'isLoading'], false)
        .setIn(['comment', 'error'], '');

    case SUBMIT_COMMENT + ERROR:
      return state
        .setIn(['comment', 'isLoading'], false)
        .setIn(['comment', 'error'], `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case DELETE_COMMENT + REQUESTED:
      return state
        .setIn(['comment', 'isLoading'], true)
        .setIn(['comment', 'error'], '');

    case DELETE_COMMENT + SUCCEDED:
      return state
        .setIn(['comment', 'isLoading'], false)
        .setIn(['comment', 'error'], '');

    case DELETE_COMMENT + ERROR:
      return state
        .setIn(['comment', 'isLoading'], false)
        .setIn(['comment', 'error'], `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case SORT_COMMENT:
      return state
        .setIn(['comments', 'model', 'sortBy'], payload);

    case SUBMIT_REVIEW + REQUESTED:
      return state
        .setIn(['review', 'isLoading'], true)
        .setIn(['review', 'error'], '');

    case SUBMIT_REVIEW + SUCCEDED:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'error'], '');

    case SUBMIT_REVIEW + ERROR:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'error'], payload.message);

    case DELETE_REVIEW + REQUESTED:
      return state
        .setIn(['review', 'isLoading'], true)
        .setIn(['review', 'error'], '');

    case DELETE_REVIEW + SUCCEDED:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'error'], '');

    case DELETE_REVIEW + ERROR:
      return state
        .setIn(['review', 'isLoading'], false)
        .setIn(['review', 'error'], `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case REVIEW + REQUESTED:
      return state
        .setIn(['reviewData', 'isLoading'], true)
        .setIn(['reviewData', 'error'], '');

    case REVIEW + SUCCEDED:
      return state
        .setIn(['reviewData', 'isLoading'], false)
        .setIn(['reviewData', 'data'], fromJS(payload.data))
        .setIn(['reviewData', 'error'], '');

    case REVIEW + FAILED:
      return state
        .setIn(['reviewData', 'isLoading'], false)
        .setIn(['reviewData', 'error'], payload);

    case VOTE_REVIEW + REQUESTED:
      return state
        .setIn(['reviewVote', 'isLoading'], true)
        .setIn(['reviewVote', 'error'], '');

    case VOTE_REVIEW + SUCCEDED:
      return state
        .setIn(['reviewVote', 'isLoading'], false)
        .setIn(['reviewVote', 'error'], '');

    case VOTE_REVIEW + ERROR:
      return state
        .setIn(['reviewVote', 'isLoading'], false)
        .setIn(['reviewVote', 'error'], `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case SORT_REVIEW:
      return state
        .setIn(['reviews', 'model', 'sortBy'], payload);

    case SET_BREADCRUMB_PATH:
      return state
        .set('breadcrumbPath', payload);

    case COMPLETE_REVIEW_FORM:
      return state
        .setIn(['reviewCompletion', ...meta.path], payload);

    case CLEAR_REVIEW_FORM:
      return state
        .setIn(['reviewCompletion', 'rating'], false)
        .setIn(['reviewCompletion', 'title'], false)
        .setIn(['reviewCompletion', 'message'], false);

    case FOLLOW_LIKE_PRODUCT + REQUESTED:
      return state
        .setIn(['productFollowLike', 'isLoading'], true)
        .setIn(['productFollowLike', 'error'], '');

    case FOLLOW_LIKE_PRODUCT + SUCCEDED:
      return state
        .setIn(['productFollowLike', 'isLoading'], false)
        .setIn(['productFollowLike', 'error'], '');

    case FOLLOW_LIKE_PRODUCT + ERROR:
      return state
        .setIn(['productFollowLike', 'isLoading'], false)
        .setIn(['productFollowLike', 'error'], payload);

    case FOLLOWS + REQUESTED:
      return state
        .setIn(['follows', 'isLoading'], true)
        .setIn(['follows', 'error'], '');

    case FOLLOWS + SUCCEDED:
      return state
        .setIn(['follows', 'count'], payload)
        .setIn(['follows', 'isLoading'], false)
        .setIn(['follows', 'error'], '');

    case FOLLOWS + ERROR:
      return state
        .setIn(['follows', 'isLoading'], false)
        .setIn(['follows', 'error'], payload);

    case LIKES + REQUESTED:
      return state
        .setIn(['likes', 'isLoading'], true)
        .setIn(['likes', 'error'], '');

    case LIKES + SUCCEDED:
      return state
        .setIn(['likes', 'count'], payload)
        .setIn(['likes', 'isLoading'], false)
        .setIn(['likes', 'error'], '');

    case LIKES + ERROR:
      return state
        .setIn(['likes', 'isLoading'], false)
        .setIn(['likes', 'error'], payload);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getModel = (category, state) => deepReplace(state.getIn(['product', category, 'model']).toJS());

// ------------------------------------
// Sagas
// ------------------------------------
function* ProductRequest({ payload: slug }) {
  try {
    const response = yield call(request, { url: `${API_URL}/products?query=${encodeURI({ slug })}&populate=business` });
    if (response.status === 200) {
      yield put(productRequestSuccess(response.data));
    } else {
      yield put(productRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(productRequestError(error));
  }
}
function* productWatcher(): Generator<Function, void, void> {
  yield takeLatest(PRODUCT + REQUESTED, ProductRequest);
}

function* OtherProductsRequest({ payload: business }) {
  try {
    const response = yield call(request, { url: `${API_URL}/products?query=${encodeURI({ business })}&page=1&per_page=4` });
    if (response.status === 200) {
      yield put(otherProductsRequestSuccess(response.data));
    } else {
      yield put(otherProductsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(otherProductsRequestError(error));
  }
}
function* otherProductsWatcher(): Generator<Function, void, void> {
  yield takeLatest(OTHER_PRODUCTS + REQUESTED, OtherProductsRequest);
}

function* CommentsRequest({ meta: { id } }) {
  const model = yield select(getModel.bind(null, 'comments'));
  try {
    const query = {
      'topic.ref': id,
      parent: { $exists: false },
    };
    const response = yield call(request, { url: `${API_URL}/comments?query=${encodeURI(query)}&populate=user,replies.user&sort=${model.sortBy}&page=${model.page}&per_page=${model.per_page}` });
    if (response.status === 200) {
      yield put(commentsRequestSuccess(response.data));
    } else {
      yield put(commentsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(commentsRequestError(error));
  }
}
function* commentsWatcher(): Generator<Function, void, void> {
  yield takeLatest(COMMENTS + REQUESTED, CommentsRequest);
}

function* CommentSubmitRequest({ payload, commentId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/comments${(commentId ? `/${commentId}/replies` : '')}`,
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    if (response.status === 200) {
      yield put(commentSubmitSuccess(response));
    } else {
      yield put(commentSubmitError(response.data));
    }
  } catch (error) {
    yield put(commentSubmitError(error));
  }
}

function* commentSubmitWatcher(): Generator<Function, void, void> {
  yield takeLatest(SUBMIT_COMMENT + REQUESTED, CommentSubmitRequest);
}

function* DeleteCommentRequest({ commentId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/comments/${commentId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(commentDeleteSuccess(response));
    } else if (response.status === 204) {
      yield put(commentDeleteSuccess(response));
    } else {
      yield put(commentDeleteError(response.data));
    }
  } catch (error) {
    yield put(commentDeleteError(error));
  }
}

function* deleteCommentWatcher(): Generator<Function, void, void> {
  yield takeLatest(DELETE_COMMENT + REQUESTED, DeleteCommentRequest);
}

function* ReviewSubmitRequest({ payload, reviewId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: reviewId ? 'PUT' : 'POST',
      url: `${API_URL}/product-reviews${(reviewId ? `/${reviewId}` : '')}`,
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    if (response.status === 200) {
      yield put(reviewSubmitSuccess(response));
      if (reviewId) {
        browserHistory.push(`${payload.url.split('/edit')[0]}`);
      } else {
        browserHistory.push(`${payload.url.split('create')[0]}reviews/${response.data.id}`);
      }
    } else {
      yield put(reviewSubmitError(response.data));
    }
  } catch (error) {
    yield put(reviewSubmitError(error));
  }
}

function* reviewSubmitWatcher(): Generator<Function, void, void> {
  yield takeLatest(SUBMIT_REVIEW + REQUESTED, ReviewSubmitRequest);
}

function* ProductReviewsRequest({ meta: { id } }) {
  const model = yield select(getModel.bind(null, 'reviews'));
  try {
    const query = {
      product: id,
      message: { $exists: true },
    };
    const encodedQuery = encodeURI(query);
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/product-reviews?query=${encodedQuery}&populate=user&sort=${model.sortBy}&page=${model.page}&per_page=${model.per_page}`,
    });
    if (response.status === 200) {
      yield put(productReviewsRequestSuccess(id, response));
    } else {
      yield put(productReviewsRequestFailed(id, response.data));
    }
  } catch (error) {
    yield put(productReviewsRequestFailed(id, error));
  }
}

function* productReviewsWatcher(): Generator<Function, void, void> {
  yield takeLatest(REVIEWS + REQUESTED, ProductReviewsRequest);
}

function* DeleteReviewRequest({ reviewId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/product-reviews/${reviewId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(reviewDeleteSuccess());
    } else if (response.status === 204) {
      yield put(reviewDeleteSuccess());
    } else {
      yield put(reviewDeleteError(response.data));
    }
  } catch (error) {
    yield put(reviewDeleteError(error));
  }
}

function* deleteReviewWatcher(): Generator<Function, void, void> {
  yield takeLatest(DELETE_REVIEW + REQUESTED, DeleteReviewRequest);
}

function* ReviewRequest({ id }) {
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/product-reviews/${id}?populate=user`,
    });
    if (response.status === 200) {
      yield put(reviewRequestSuccess(response));
    } else {
      yield put(reviewRequestFailed(response.data));
    }
  } catch (error) {
    yield put(reviewRequestFailed(error));
  }
}

function* reviewWatcher(): Generator<Function, void, void> {
  yield takeLatest(REVIEW + REQUESTED, ReviewRequest);
}

function* VoteReviewRequest({ reviewId, meta: { type } }) {
  try {
    const token = yield select(getToken);
    let url = `${API_URL}/product-reviews/${reviewId}/`;
    if (type === 'up') {
      url += 'upvotes';
    } else if (type === 'down') {
      url += 'downvotes';
    }
    const response = yield call(request, {
      method: 'POST',
      url,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(reviewVoteSuccess(response));
    } else {
      yield put(reviewVoteError(response.data));
    }
  } catch (error) {
    yield put(reviewVoteError(error));
  }
}

function* voteReviewWatcher(): Generator<Function, void, void> {
  yield takeLatest(VOTE_REVIEW + REQUESTED, VoteReviewRequest);
}

function* FollowLikeProductRequest({ productId, actionType }) {
  try {
    const token = yield select(getToken);
    const url = `${API_URL}/${actionType}s`;
    const response = yield call(request, {
      method: 'POST',
      url,
      data: {
        item: productId,
        itemType: 'Product',
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(productFollowLikeSuccess());
    } else {
      yield put(productFollowLikeError(response.data));
    }
  } catch (error) {
    yield put(productFollowLikeError(error));
  }
}

function* followLikeProductWatcher(): Generator<Function, void, void> {
  yield takeLatest(FOLLOW_LIKE_PRODUCT + REQUESTED, FollowLikeProductRequest);
}

function* ProductFollowsRequest({ payload }) {
  try {
    const query = { item: payload };
    const encodedQuery = encodeURI(query);
    const url = `${API_URL}/follows?query=${encodedQuery}&op=count`;
    const response = yield call(request, {
      method: 'GET',
      url,
    });
    if (response.status === 200) {
      yield put(productFollowsRequestSuccess(response.data.count));
    } else {
      yield put(productFollowsRequestFailed(response.data));
    }
  } catch (error) {
    yield put(productFollowsRequestFailed(error));
  }
}

function* productFollowsWatcher(): Generator<Function, void, void> {
  yield takeLatest(FOLLOWS + REQUESTED, ProductFollowsRequest);
}

function* ProductLikesRequest({ payload }) {
  try {
    const query = { item: payload };
    const encodedQuery = encodeURI(query);
    const url = `${API_URL}/likes?query=${encodedQuery}&op=count`;
    const response = yield call(request, {
      method: 'GET',
      url,
    });
    if (response.status === 200) {
      yield put(productLikesRequestSuccess(response.data.count));
    } else {
      yield put(productLikesRequestFailed(response.data));
    }
  } catch (error) {
    yield put(productFollowsRequestFailed(error));
  }
}

function* productLikesWatcher(): Generator<Function, void, void> {
  yield takeLatest(LIKES + REQUESTED, ProductLikesRequest);
}

export default [
  productWatcher,
  otherProductsWatcher,
  commentsWatcher,
  commentSubmitWatcher,
  deleteCommentWatcher,
  reviewSubmitWatcher,
  productReviewsWatcher,
  deleteReviewWatcher,
  reviewWatcher,
  voteReviewWatcher,
  followLikeProductWatcher,
  productFollowsWatcher,
  productLikesWatcher,
];
