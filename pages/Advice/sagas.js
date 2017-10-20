// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import type { Map } from 'immutable';
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, STARTED, SUCCEDED, FAILED } from 'containers/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const GET_CATEGORIES = 'Lift/Advice/GET_CATEGORIES';
const GET_QUESTIONS = 'Lift/Advice/GET_QUESTIONS';
// ------------------------------------
// Actions
// ------------------------------------
export const requestCategories = (slug?: string) => ({
  type: GET_CATEGORIES + REQUESTED,
  payload: { slug },
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

export const requestQuestions = (filter: Map<string, string>) => ({
  type: GET_QUESTIONS + REQUESTED,
  payload: {
    filter,
  },
});
const questionsRequestSuccess = (data: Object) => ({
  type: GET_QUESTIONS + SUCCEDED,
  payload: data,
});
const questionsRequestFailed = (error: string) => ({
  type: GET_QUESTIONS + FAILED,
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
  questions: {
    data: [],
    isLoading: true,
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
    case GET_QUESTIONS + REQUESTED:
      return state
        .setIn(['questions', 'isLoading'], true);
    case GET_QUESTIONS + SUCCEDED:
      return state
        .setIn(['questions', 'isLoading'], false)
        .setIn(
          ['questions', 'data'], fromJS(payload.data));
    case GET_QUESTIONS + FAILED:
      return state
        .setIn(['questions', 'isLoading'], false);
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
    const select = '["name", "slug", "description", "bannerPhoto"]';
    const data = yield call(request, { url: `${API_URL}/knowledge-base/categories?select=${select}` });
    yield put(categoriesRequestSuccess(data));
  } catch (error) {
    yield put(categoriesRequestFailed(error));
  }
}

function* QuestionsRequest({ payload: { filter } }) {
  try {
    let query = {
      correctAnswer: {
        $exists: filter.get('questionState') !== 'open',
      },
    };
    if (filter.get('category') !== 'all') {
      query.category = filter.get('category');
    }
    query = encodeURI(query);
    const data = yield call(request, { url: `${API_URL}/knowledge-base/questions?query=${query}&sort=${filter.get('sort')}&page=${filter.get('page')}&populate=answers,user` });

    yield put(questionsRequestSuccess(data));
  } catch (error) {
    yield put(questionsRequestFailed(error));
  }
}


function* categoriesWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_CATEGORIES + REQUESTED, CategoriesRequest);
}
function* questionsWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_QUESTIONS + REQUESTED, QuestionsRequest);
}

export default [
  categoriesWatcher,
  questionsWatcher,
];
