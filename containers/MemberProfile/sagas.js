// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import deepReplace from 'utils/deepReplace';
import { stringify } from 'qs';
import { API_URL, REQUESTED, SUCCEDED, FAILED } from 'containers/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const PROFILE = 'Lift/Member/PROFILE';
const REVIEWS = 'Lift/Member/REVIEWS';
const FOLLOWINGS = 'Lift/Member/FOLLOWINGS';
const REVIEWS_COUNT = 'Lift/Member/REVIEWS_COUNT';
const HELPFUL_REVIEWS_COUNT = 'Lift/Member/HELPFUL_REVIEWS_COUNT';

// ------------------------------------
// Actions
// ------------------------------------
export const requestMemberProfile = (slug: string) => ({
  type: PROFILE + REQUESTED,
  payload: slug,
});
const profileRequestSuccess = (data: Object) => ({
  type: PROFILE + SUCCEDED,
  payload: data,
});
const profileRequestFailed = () => ({
  type: PROFILE + FAILED,
});

export const requestReviews = (userId: string) => ({
  type: REVIEWS + REQUESTED,
  payload: userId,
});
const reviewsRequestSuccess = (data: Object) => ({
  type: REVIEWS + SUCCEDED,
  payload: data,
});
const reviewsRequestFailed = () => ({
  type: REVIEWS + FAILED,
});

export const requestReviewsCount = (userId: string) => ({
  type: REVIEWS_COUNT + REQUESTED,
  payload: userId,
});
const reviewsCountRequestSuccess = (data: string) => ({
  type: REVIEWS_COUNT + SUCCEDED,
  payload: data,
});
const reviewsCountRequestFailed = (error) => ({
  type: REVIEWS_COUNT + FAILED,
  payload: error,
});

const helpfulReviewsCountRequestSuccess = (data: string) => ({
  type: HELPFUL_REVIEWS_COUNT + SUCCEDED,
  payload: data,
});
const helpfulReviewsCountRequestFailed = () => ({
  type: HELPFUL_REVIEWS_COUNT + FAILED,
});

export const requestFollowings = (userId: string, path: string, value: Object) => ({
  type: FOLLOWINGS + REQUESTED,
  payload: userId,
  meta: {
    path,
    value,
  },
});
const followingsRequestSuccess = (data: Object) => ({
  type: FOLLOWINGS + SUCCEDED,
  payload: data,
});
const followingsRequestFailed = () => ({
  type: FOLLOWINGS + FAILED,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  profile: {
    isLoading: true,
    data: null,
  },
  reviews: {
    isLoading: true,
    data: null,
  },
  followings: {
    filter: {
      model: {
        page: 1,
        per_page: 6,
      },
    },
    isLoading: false,
    data: null,
  },
  reviewsCount: null,
  helpfulReviewsCount: null,
});

let newState = {};

export const reducer = (state: State = initialState, { type, payload, meta }: Action) => {
  switch (type) {
    case PROFILE + SUCCEDED:
      return state
        .setIn(['profile', 'isLoading'], false)
        .setIn(['profile', 'data'], fromJS(payload.data));

    case PROFILE + FAILED:
      return state
        .setIn(['profile', 'isLoading'], false);

    case REVIEWS + SUCCEDED:
      return state
        .setIn(['reviews', 'isLoading'], false)
        .setIn(['reviews', 'data'], fromJS(payload.data));

    case REVIEWS + FAILED:
      return state
        .setIn(['reviews', 'isLoading'], false);

    case REVIEWS_COUNT + SUCCEDED:
      return state
        .set('reviewsCount', payload.data.count);

    case HELPFUL_REVIEWS_COUNT + SUCCEDED:
      return state
        .set('helpfulReviewsCount', payload.data.count);

    case HELPFUL_REVIEWS_COUNT + FAILED:
      return state;

    case FOLLOWINGS + REQUESTED:
      newState = state.setIn(['followings', 'isLoading'], true);

      if (meta.path) {
        return newState.setIn(['followings', 'filter', ...meta.path], fromJS(meta.value));
      }
      return newState;

    case FOLLOWINGS + SUCCEDED:
      return state
        .setIn(['followings', 'isLoading'], false)
        .setIn(['followings', 'data'], fromJS(payload.data));

    case FOLLOWINGS + FAILED:
      return state
        .setIn(['followings', 'isLoading'], false);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getUser = (state) => state.getIn(['memberProfile', 'profile', 'data', 'hits', 0, '_id']);
const getModel = (category, state) => deepReplace(state.getIn(['memberProfile', category, 'filter', 'model']).toJS());
// ------------------------------------
// Sagas
// ------------------------------------
function* ProfileRequest({ payload: slug }) {
  try {
    const response = yield call(request, { url: `${API_URL}/users?query=${encodeURI({ slug })}` });
    yield put(profileRequestSuccess(response));
  } catch (error) {
    yield put(profileRequestFailed());
  }
}

function* profileWatcher(): Generator<Function, void, void> {
  yield takeLatest(PROFILE + REQUESTED, ProfileRequest);
}

function* ReviewsRequest({ payload: user }) {
  try {
    const reviews = yield call(
      request,
      { url: `${API_URL}/product-reviews?query=${encodeURI({ user })}&populate=product` }
    );
    yield put(reviewsRequestSuccess(reviews));
  } catch (error) {
    yield put(reviewsRequestFailed());
  }
}

function* reviewsWatcher(): Generator<Function, void, void> {
  yield takeLatest(REVIEWS + REQUESTED, ReviewsRequest);
}

function* ReviewsCountRequest() {
  const user = yield select(getUser.bind(null));
  try {
    const reviews = yield call(
      request,
      { url: `${API_URL}/product-reviews?query=${encodeURI({ user })}&op=count` }
    );
    yield put(reviewsCountRequestSuccess(reviews));
  } catch (error) {
    yield put(reviewsCountRequestFailed());
  }

  try {
    const helpfulReviews = yield call(
      request,
      { url: `${API_URL}/product-reviews?query=${encodeURI({
        user,
        upVotes: { $exists: true },
        $where: 'this.upVotes.length>0',
      })}&op=count` }
    );
    yield put(helpfulReviewsCountRequestSuccess(helpfulReviews));
  } catch (error) {
    yield put(helpfulReviewsCountRequestFailed());
  }
}

function* reviewsCountWatcher(): Generator<Function, void, void> {
  yield takeLatest(REVIEWS_COUNT + REQUESTED, ReviewsCountRequest);
}

function* FollowingsRequest({ payload: user }) {
  const model = yield select(getModel.bind(null, 'followings'));
  try {
    const reviews = yield call(
      request,
      {
        url: `${API_URL}/follows?query=${encodeURI({
          user,
          itemType: 'Product',
        })}&${stringify(model)}` }
    );
    yield put(followingsRequestSuccess(reviews));
  } catch (error) {
    yield put(followingsRequestFailed());
  }
}

function* followingsWatcher(): Generator<Function, void, void> {
  yield takeLatest(FOLLOWINGS + REQUESTED, FollowingsRequest);
}


export default [
  profileWatcher,
  reviewsWatcher,
  reviewsCountWatcher,
  followingsWatcher,
];
