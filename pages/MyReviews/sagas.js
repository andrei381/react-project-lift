// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, SUCCEDED, FAILED } from 'containers/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const REVIEWS = 'Lift/ME/REVIEWS';

// ------------------------------------
// Actions
// ------------------------------------
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

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isLoading: true,
  data: null,
});

export const reducer = (state: State = initialState, { type, payload }: Action) => {
  switch (type) {
    case REVIEWS + REQUESTED:
      return state
        .setIn(['isLoading'], true);

    case REVIEWS + SUCCEDED:
      return state
        .setIn(['isLoading'], false)
        .setIn(['data'], fromJS(payload.data));

    case REVIEWS + FAILED:
      return state
        .setIn(['reviews', 'isLoading'], false);
    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
// ------------------------------------
// Sagas
// ------------------------------------
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

export default [
  reviewsWatcher,
];
