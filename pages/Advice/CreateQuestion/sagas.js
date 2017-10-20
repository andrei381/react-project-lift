// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, STARTED, SUCCEDED, FAILED, ERROR } from 'containers/constants';
import type { Action, State } from 'types/common';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const GET_CATEGORIES = 'Lift/Question/GET_CATEGORIES';
const POST_QUESTION = 'Lift/Question/POST_QUESTION';

// ------------------------------------
// Actions
// ------------------------------------
export const requestCategories = () => ({
  type: GET_CATEGORIES + REQUESTED,
});
const startCategoriesRequest = () => ({
  type: GET_CATEGORIES + STARTED,
});
const categoriesRequestSuccess = (data: Object) => ({
  type: GET_CATEGORIES + SUCCEDED,
  payload: data,
});
const categoriesRequestFailed = (error: string) => ({
  type: GET_CATEGORIES + FAILED,
  payload: error,
});

export const requestCreateQuestion = (data: Object) => ({
  type: POST_QUESTION + REQUESTED,
  payload: {
    ...data,
    tags: data.tags.split(','),
  },
});
const createQuestionSuccess = (response: Object) => ({
  type: POST_QUESTION + SUCCEDED,
  payload: response,
});
const createQuestionError = (error: string) => ({
  type: POST_QUESTION + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  categories: {
    isLoading: true,
    data: {},
  },
  questionForm: {
    isLoading: false,
    error: '',
    data: {},
  },
});

export const reducer = (state: State = initialState, { type, payload }: Action) => {
  switch (type) {
    case GET_CATEGORIES + STARTED:
      return state
        .setIn(['categories', 'isLoading'], true);

    case GET_CATEGORIES + SUCCEDED:
      return state
        .setIn(['categories', 'isLoading'], false)
        .setIn(
          ['categories', 'data'], fromJS(payload.data));
    case GET_CATEGORIES + FAILED:
      return state
        .setIn(['categories', 'isLoading'], false);

    case POST_QUESTION + REQUESTED:
      return state
        .setIn(['questionForm', 'isLoading'], true);
    case POST_QUESTION + SUCCEDED:
      return state
        .setIn(['questionForm', 'isLoading'], false)
        .setIn(['questionForm', 'error'], '')
        .setIn(['questionForm', 'data'], fromJS(payload.data));
    case POST_QUESTION + ERROR:
      return state
        .setIn(['questionForm', 'isLoading'], false)
        .setIn(['questionForm', 'error'], fromJS(payload.message));

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
function* CategoriesRequest() {
  try {
    yield put(startCategoriesRequest());
    const query = '["name", "slug", "description", "bannerPhoto"]';
    const data = yield call(request, { url: `${API_URL}/knowledge-base/categories?select=${query}` });
    yield put(categoriesRequestSuccess(data));
  } catch (error) {
    yield put(categoriesRequestFailed(error));
  }
}

function* CreateQuestionRequest({ payload }) {
  try {
    const token = yield select(getToken);
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/knowledge-base/questions`,
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    });
    if (response.status === 200) {
      yield put(createQuestionSuccess(response));
    } else {
      yield put(createQuestionError(response.data));
    }
  } catch (error) {
    yield put(createQuestionError(error));
  }
}

function* categoriesWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_CATEGORIES + REQUESTED, CategoriesRequest);
}

function* createQuestionWatcher(): Generator<Function, void, void> {
  yield takeLatest(POST_QUESTION + REQUESTED, CreateQuestionRequest);
}

export default [
  categoriesWatcher,
  createQuestionWatcher,
];
