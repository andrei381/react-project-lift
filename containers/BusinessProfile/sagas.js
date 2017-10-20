// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
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
const GET_BUSINESS_PROFILE = 'Lift/Profile/GET_BUSINESS_PROFILE';
const GET_BUSINESS_COMMENTS = 'Lift/Profile/GET_BUSINESS_COMMENTS';
const GET_BUSINESS_REVIEWS = 'Lift/Profile/GET_BUSINESS_REVIEWS';
const GET_BUSINESS_PRODUCTS = 'Lift/Profile/GET_BUSINESS_PRODUCTS';
const COMMENT = 'Lift/Profile/COMMENT';
const SUBMIT_REVIEW = 'Lift/Profile/SUBMIT_REVIEW';
const GET_REVIEW = 'Lift/Profile/GET_REVIEW';
const DELETE_COMMENT = 'Lift/Profile/DELETE_COMMENT';
const DELETE_REVIEW = 'Lift/Profile/DELETE_REVIEW';
const VOTE_REVIEW = 'Lift/Profile/VOTE_REVIEW';
const SORT_REVIEW = 'Lift/Profile/SORT_REVIEW';
const SORT_COMMENT = 'Lift/Profile/SORT_COMMENT';
const COMPLETE_REVIEW_FORM = 'Lift/Profile/COMPLETE_REVIEW_FORM';
const CLEAR_REVIEW_FORM = 'Lift/Profile/CLEAR_REVIEW_FORM';
const FOLLOW_LIKE_BUSINESS = 'Lift/Profile/FOLLOW_LIKE_BUSINESS';
const FOLLOWS = 'Lift/Profile/FOLLOWS';
const LIKES = 'Lift/Profile/LIKES';
const SET_BREADCRUMB_PATH = 'Lift/Profile/SET_BREADCRUMB_PATH';
// ------------------------------------
// Actions
// ------------------------------------

export const requestBusinessProfile = (slug: string, value: Object) => (
  {
    type: GET_BUSINESS_PROFILE + REQUESTED,
    payload: value,
    slug,
  }
);
const businessProfileRequestSuccess = (data: Object) => ({
  type: GET_BUSINESS_PROFILE + SUCCEDED,
  payload: data,
});
const businessProfileRequestFailed = (error: string) => ({
  type: GET_BUSINESS_PROFILE + FAILED,
  payload: error,
});

export const requestBusinessComments = (id: string, path: string, value: ?Object) => (
  {
    type: GET_BUSINESS_COMMENTS + REQUESTED,
    payload: value,
    meta: {
      id,
      path,
    },
  }
);
const businessCommentsRequestSuccess = (id: string, data: Object) => ({
  type: GET_BUSINESS_COMMENTS + SUCCEDED,
  payload: data,
  meta: { id },
});
const businessCommentsRequestFailed = (id: string, error: string) => ({
  type: GET_BUSINESS_COMMENTS + FAILED,
  payload: error,
  meta: { id },
});

export const requestBusinessReviews = (id: string, path: string, value: ?Object) => (
  {
    type: GET_BUSINESS_REVIEWS + REQUESTED,
    payload: value,
    meta: {
      id,
      path,
    },
  }
);
const businessReviewsRequestSuccess = (id: string, data: Object) => ({
  type: GET_BUSINESS_REVIEWS + SUCCEDED,
  payload: data,
  meta: { id },
});
const businessReviewsRequestFailed = (id: string, error: string) => ({
  type: GET_BUSINESS_REVIEWS + FAILED,
  payload: error,
  meta: { id },
});

export const requestBusinessProducts = (id: string, path: string, value: ?Object) => (
  {
    type: GET_BUSINESS_PRODUCTS + REQUESTED,
    payload: value,
    meta: {
      id,
      path,
    },
  }
);
const businessProductsRequestSuccess = (id: string, data: Object) => ({
  type: GET_BUSINESS_PRODUCTS + SUCCEDED,
  payload: data,
  meta: { id },
});
const businessProductsRequestFailed = (id: string, error: string) => ({
  type: GET_BUSINESS_PRODUCTS + FAILED,
  payload: error,
  meta: { id },
});

export const requestComment = (payload: Object, commentId: string) => ({
  type: COMMENT + REQUESTED,
  payload,
  commentId,
});
const commentRequestSuccess = (payload: Object) => ({
  type: COMMENT + SUCCEDED,
  payload,
  meta: {
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        event: 'business-comment-created',
        properties: {
          comment: payload.data,
        },
      },
    },
  },
});
const commentRequestError = (error) => ({
  type: COMMENT + ERROR,
  payload: error,
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
        event: 'business-review-created',
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


export const requestReview = (id: string) => ({
  type: GET_REVIEW + REQUESTED,
  id,
});
const reviewRequestSuccess = (data: Object) => ({
  type: GET_REVIEW + SUCCEDED,
  payload: data,
});
const reviewRequestFailed = (error: string) => ({
  type: GET_REVIEW + FAILED,
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


export const deleteReview = (reviewId: string) => ({
  type: DELETE_REVIEW + REQUESTED,
  reviewId,
});
const reviewDeleteSuccess = (reviewId: string) => ({
  type: DELETE_REVIEW + SUCCEDED,
  reviewId,
});
const reviewDeleteError = (error) => ({
  type: DELETE_REVIEW + ERROR,
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

export const sortComment = (sortBy: string) => ({
  type: SORT_COMMENT,
  payload: sortBy,
});

export const completeReviewForm = (path: string, value: boolean) => ({
  type: COMPLETE_REVIEW_FORM,
  payload: value,
  meta: { path },
});

export const clearReviewForm = () => ({
  type: CLEAR_REVIEW_FORM,
});

export const followLikeBusiness = (businessId: string, actionType: string) => ({
  type: FOLLOW_LIKE_BUSINESS + REQUESTED,
  businessId,
  actionType,
});
const businessFollowLikeSuccess = () => ({
  type: FOLLOW_LIKE_BUSINESS + SUCCEDED,
});
const businessFollowLikeError = (error) => ({
  type: FOLLOW_LIKE_BUSINESS + ERROR,
  payload: error,
});

export const requestBusinessFollows = (id: string) => ({
  type: FOLLOWS + REQUESTED,
  payload: id,
});
const businessFollowsRequestSuccess = (count: number) => ({
  type: FOLLOWS + SUCCEDED,
  payload: count,
});
const businessFollowsRequestFailed = (error) => ({
  type: FOLLOWS + FAILED,
  payload: error,
});

export const requestBusinessLikes = (id: string) => ({
  type: LIKES + REQUESTED,
  payload: id,
});
const businessLikesRequestSuccess = (count: number) => ({
  type: LIKES + SUCCEDED,
  payload: count,
});
const businessLikesRequestFailed = (error) => ({
  type: LIKES + FAILED,
  payload: error,
});

export const setBreadcrumbPath = (path: List<Map<string, Object>>) => ({
  type: SET_BREADCRUMB_PATH,
  payload: path,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  business: {
    data: {},
    meta: {},
    isLoading: true,
    error: '',
  },
  breadcrumbPath: null,
  products: {
    data: {
      hits: {},
    },
    model: {
      page: 1,
      perPage: 8,
      sortBy: '-rating',
    },
    isLoading: false,
    url: `${API_URL}/products`,
  },
  reviews: {
    data: {
      hits: {},
    },
    model: {
      page: 1,
      perPage: 10,
      sortBy: '-rating',
    },
    isLoading: false,
    url: `${API_URL}/business-reviews`,
  },
  reviewVote: {
    isLoading: false,
    error: '',
  },
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
    url: `${API_URL}/comments`,
  },
  comment: {
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
  reviewCompletion: {
    rating: false,
    title: false,
    message: false,
  },
  businessFollowLike: {
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
    case GET_BUSINESS_PROFILE + REQUESTED:
      newState = state.setIn(['business', 'isLoading'], true)
        .setIn(['business', 'error'], '');
      return newState;

    case GET_BUSINESS_PROFILE + SUCCEDED:
      return state
        .setIn(['business', 'isLoading'], false)
        .setIn(['business', 'data'], fromJS(payload))
        .setIn(['business', 'error'], '');

    case GET_BUSINESS_PROFILE + FAILED:
      return state
        .setIn(['business', 'isLoading'], false)
        .setIn(['business', 'error'], payload);

    case GET_BUSINESS_COMMENTS + REQUESTED:
      newState = state.setIn(['comments', 'isLoading'], true);
      if (meta.path) return newState.setIn(['comments', 'model', ...meta.path], fromJS(payload));
      return newState;

    case GET_BUSINESS_COMMENTS + SUCCEDED:
      return state
        .setIn(['comments', 'isLoading'], false)
        .setIn(['comments', 'data'], fromJS(payload.data));

    case GET_BUSINESS_COMMENTS + FAILED:
      return state
        .setIn(['comments', 'isLoading'], false);

    case GET_BUSINESS_REVIEWS + REQUESTED:
      newState = state.setIn(['reviews', 'isLoading'], true);
      if (meta.path) return newState.setIn(['reviews', 'model', ...meta.path], fromJS(payload));
      return newState;

    case GET_BUSINESS_REVIEWS + SUCCEDED:
      return state
        .setIn(['reviews', 'isLoading'], false)
        .setIn(['reviews', 'data'], fromJS(payload.data));

    case GET_BUSINESS_REVIEWS + FAILED:
      return state
        .setIn(['reviews', 'isLoading'], false);

    case GET_BUSINESS_PRODUCTS + REQUESTED:
      newState = state.setIn(['products', 'isLoading'], true);
      if (meta.path) return newState.setIn(['products', 'model', ...meta.path], fromJS(payload));
      return newState;

    case GET_BUSINESS_PRODUCTS + SUCCEDED:
      return state
        .setIn(['products', 'isLoading'], false)
        .setIn(['products', 'data'], fromJS(payload.data));

    case GET_BUSINESS_PRODUCTS + FAILED:
      return state
        .setIn(['products', 'isLoading'], false);

    case COMMENT + REQUESTED:
      return state
        .setIn(['comment', 'isLoading'], true)
        .setIn(['comment', 'error'], '');

    case COMMENT + SUCCEDED:
      return state
        .setIn(['comment', 'isLoading'], false)
        .setIn(['comment', 'error'], '');

    case COMMENT + ERROR:
      return state
        .setIn(['comment', 'isLoading'], false)
        .setIn(['comment', 'error'], `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

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
        .setIn(['review', 'error'], `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case GET_REVIEW + REQUESTED:
      newState = state.setIn(['reviewData', 'isLoading'], true)
        .setIn(['reviewData', 'error'], '');
      return newState;

    case GET_REVIEW + SUCCEDED:
      return state
        .setIn(['reviewData', 'isLoading'], false)
        .setIn(['reviewData', 'data'], fromJS(payload.data))
        .setIn(['reviewData', 'error'], '');

    case GET_REVIEW + FAILED:
      return state
        .setIn(['reviewData', 'isLoading'], false)
        .setIn(['reviewData', 'error'], payload);

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

    case SORT_COMMENT:
      return state
        .setIn(['comments', 'model', 'sortBy'], payload);

    case COMPLETE_REVIEW_FORM:
      return state
        .setIn(['reviewCompletion', ...meta.path], payload);

    case CLEAR_REVIEW_FORM:
      return state
        .setIn(['reviewCompletion', 'rating'], false)
        .setIn(['reviewCompletion', 'title'], false)
        .setIn(['reviewCompletion', 'message'], false);

    case FOLLOW_LIKE_BUSINESS + REQUESTED:
      return state
        .setIn(['businessFollowLike', 'isLoading'], true)
        .setIn(['businessFollowLike', 'error'], '');

    case FOLLOW_LIKE_BUSINESS + SUCCEDED:
      return state
        .setIn(['businessFollowLike', 'isLoading'], false)
        .setIn(['businessFollowLike', 'error'], '');

    case FOLLOW_LIKE_BUSINESS + ERROR:
      return state
        .setIn(['businessFollowLike', 'isLoading'], false)
        .setIn(['businessFollowLike', 'error'], payload);

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

    case SET_BREADCRUMB_PATH:
      return state
        .set('breadcrumbPath', payload);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getUrl = (category, path, state) => state.getIn(['profile', category, path]);
const getModel = (category, state) => deepReplace(state.getIn(['profile', category, 'model']).toJS());
// ------------------------------------
// Sagas
// ------------------------------------

function* BusinessProfileRequest({ slug }) {
  const url = `${API_URL}/businesses?query=${encodeURI({ slug })}&flat=true`;
  try {
    const response = yield call(request, {
      method: 'GET',
      url,
    });
    if (response.status === 200) {
      yield put(businessProfileRequestSuccess(response.data[0]));
    } else {
      yield put(businessProfileRequestFailed(response.data));
    }
  } catch (error) {
    yield put(businessProfileRequestFailed(error));
  }
}

function* BusinessCommentsRequest({ meta: { id } }) {
  const url = yield select(getUrl.bind(null, 'comments', 'url'));
  const model = yield select(getModel.bind(null, 'comments'));
  try {
    const query = {
      'topic.ref': id,
      parent: { $exists: false },
    };
    const encodedQuery = encodeURI(query);
    const response = yield call(request, {
      method: 'GET',
      url: `${url}?query=${encodedQuery}&populate=user,replies.user&sort=${model.sortBy}&page=${model.page}&per_page=${model.per_page}`,
    });
    if (response.status === 200) {
      yield put(businessCommentsRequestSuccess(id, response));
    } else {
      yield put(businessCommentsRequestFailed(id, response.data));
    }
  } catch (error) {
    yield put(businessCommentsRequestFailed(id, error));
  }
}

function* BusinessReviewsRequest({ meta: { id } }) {
  const url = yield select(getUrl.bind(null, 'reviews', 'url'));
  const model = yield select(getModel.bind(null, 'reviews'));
  try {
    const query = {
      business: id,
    };
    const encodedQuery = encodeURI(query);
    const response = yield call(request, {
      method: 'GET',
      url: `${url}?query=${encodedQuery}&populate=user&sort=${model.sortBy}&page=${model.page}&per_page=${model.perPage}`,
    });
    if (response.status === 200) {
      yield put(businessReviewsRequestSuccess(id, response));
    } else {
      yield put(businessReviewsRequestFailed(id, response.data));
    }
  } catch (error) {
    yield put(businessReviewsRequestFailed(id, error));
  }
}

function* BusinessProductsRequest({ meta: { id } }) {
  const url = yield select(getUrl.bind(null, 'products', 'url'));
  const model = yield select(getModel.bind(null, 'products'));
  try {
    const query = {
      business: id,
    };
    const encodedQuery = encodeURI(query);
    const response = yield call(request, {
      method: 'GET',
      url: `${url}?query=${encodedQuery}&populate=user&page=${model.page}&per_page=${model.perPage}`,
    });
    if (response.status === 200) {
      yield put(businessProductsRequestSuccess(id, response));
    } else {
      yield put(businessProductsRequestFailed(id, response.data));
    }
  } catch (error) {
    yield put(businessProductsRequestFailed(id, error));
  }
}

function* CommentRequest({ payload, commentId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/comments${(commentId ? `/${commentId}/replies` : '')}`,
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    if (response.status === 200) {
      yield put(commentRequestSuccess(response));
    } else {
      yield put(commentRequestError(response.data));
    }
  } catch (error) {
    yield put(commentRequestError(error));
  }
}

function* ReviewSubmitRequest({ payload, reviewId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: reviewId ? 'PUT' : 'POST',
      url: `${API_URL}/business-reviews${reviewId ? `/${reviewId}` : ''}`,
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
      yield put(reviewSubmitError(response.data.message));
    }
  } catch (error) {
    yield put(reviewSubmitError(error));
  }
}

function* ReviewRequest({ id }) {
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/business-reviews/${id}?populate=user`,
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
    } else
    if (response.status === 204) {
      yield put(commentDeleteSuccess(response));
    } else {
      yield put(commentDeleteError(response.data));
    }
  } catch (error) {
    yield put(commentDeleteError(error));
  }
}

function* DeleteReviewRequest({ reviewId }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/business-reviews/${reviewId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 204) {
      yield put(reviewDeleteSuccess(response));
    } else {
      yield put(reviewDeleteError(response.data));
    }
  } catch (error) {
    yield put(reviewDeleteError(error));
  }
}

function* VoteReviewRequest({ reviewId, meta: { type } }) {
  try {
    const token = yield select(getToken);
    let url = `${API_URL}/business-reviews/${reviewId}/`;
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

function* businessProfileWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_BUSINESS_PROFILE + REQUESTED, BusinessProfileRequest);
}

function* businessCommentsWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_BUSINESS_COMMENTS + REQUESTED, BusinessCommentsRequest);
}

function* businessReviewsWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_BUSINESS_REVIEWS + REQUESTED, BusinessReviewsRequest);
}

function* businessProductsWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_BUSINESS_PRODUCTS + REQUESTED, BusinessProductsRequest);
}

function* commentWatcher(): Generator<Function, void, void> {
  yield takeLatest(COMMENT + REQUESTED, CommentRequest);
}

function* reviewSubmitWatcher(): Generator<Function, void, void> {
  yield takeLatest(SUBMIT_REVIEW + REQUESTED, ReviewSubmitRequest);
}

function* reviewWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_REVIEW + REQUESTED, ReviewRequest);
}

function* deleteCommentWatcher(): Generator<Function, void, void> {
  yield takeLatest(DELETE_COMMENT + REQUESTED, DeleteCommentRequest);
}

function* deleteReviewWatcher(): Generator<Function, void, void> {
  yield takeLatest(DELETE_REVIEW + REQUESTED, DeleteReviewRequest);
}

function* voteReviewWatcher(): Generator<Function, void, void> {
  yield takeLatest(VOTE_REVIEW + REQUESTED, VoteReviewRequest);
}

function* FollowLikeBusinessRequest({ businessId, actionType }) {
  try {
    const token = yield select(getToken);
    const url = `${API_URL}/${actionType}s`;
    const response = yield call(request, {
      method: 'POST',
      url,
      data: {
        item: businessId,
        itemType: 'Business',
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(businessFollowLikeSuccess());
    } else {
      yield put(businessFollowLikeError(response.data));
    }
  } catch (error) {
    yield put(businessFollowLikeError(error));
  }
}

function* followLikeBusinessWatcher(): Generator<Function, void, void> {
  yield takeLatest(FOLLOW_LIKE_BUSINESS + REQUESTED, FollowLikeBusinessRequest);
}

function* BusinessFollowsRequest({ payload }) {
  try {
    const query = { item: payload };
    const encodedQuery = encodeURI(query);
    const url = `${API_URL}/follows?query=${encodedQuery}&op=count`;
    const response = yield call(request, {
      method: 'GET',
      url,
    });
    if (response.status === 200) {
      yield put(businessFollowsRequestSuccess(response.data.count));
    } else {
      yield put(businessFollowsRequestFailed(response.data));
    }
  } catch (error) {
    yield put(businessFollowsRequestFailed(error));
  }
}

function* businessFollowsWatcher(): Generator<Function, void, void> {
  yield takeLatest(FOLLOWS + REQUESTED, BusinessFollowsRequest);
}

function* BusinessLikesRequest({ payload }) {
  try {
    const query = { item: payload };
    const encodedQuery = encodeURI(query);
    const url = `${API_URL}/likes?query=${encodedQuery}&op=count`;
    const response = yield call(request, {
      method: 'GET',
      url,
    });
    if (response.status === 200) {
      yield put(businessLikesRequestSuccess(response.data.count));
    } else {
      yield put(businessLikesRequestFailed(response.data));
    }
  } catch (error) {
    yield put(businessFollowsRequestFailed(error));
  }
}

function* businessLikesWatcher(): Generator<Function, void, void> {
  yield takeLatest(LIKES + REQUESTED, BusinessLikesRequest);
}

export default [
  businessProfileWatcher,
  businessCommentsWatcher,
  commentWatcher,
  reviewSubmitWatcher,
  reviewWatcher,
  businessReviewsWatcher,
  businessProductsWatcher,
  deleteCommentWatcher,
  deleteReviewWatcher,
  voteReviewWatcher,
  followLikeBusinessWatcher,
  businessFollowsWatcher,
  businessLikesWatcher,
];
