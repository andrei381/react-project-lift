// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, STARTED, SKIPPED, SUCCEDED, FAILED } from 'containers/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const GET_FILTERABLE_PRODUCTS = 'Lift/HomePage/GET_FILTERABLE_PRODUCTS';
const GET_RECENT_NEWS = 'Lift/HomePage/GET_RECENT_NEWS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestFilterableProducts = (index: number, category: string) => ({
  type: GET_FILTERABLE_PRODUCTS + REQUESTED,
  payload: index,
  meta: { category },
});
const startFilterableProductsRequest = (category: string) => ({
  type: GET_FILTERABLE_PRODUCTS + STARTED,
  meta: { category },
});
const skipFilterableProductsRequest = () => ({
  type: GET_FILTERABLE_PRODUCTS + SKIPPED,
});
const filterableProductsRequestSuccess = (category: string, index: number, data: Object) => ({
  type: GET_FILTERABLE_PRODUCTS + SUCCEDED,
  payload: data,
  meta: {
    index,
    category,
  },
});
const filterableProductsRequestFailed = (error) => ({
  type: GET_FILTERABLE_PRODUCTS + FAILED,
  payload: error,
});

export const requestRecentNews = () => ({
  type: GET_RECENT_NEWS + REQUESTED,
});
const recentNewsRequestSuccess = (data: Object) => ({
  type: GET_RECENT_NEWS + SUCCEDED,
  payload: data,
});
const recentNewsRequestFailed = (error) => ({
  type: GET_RECENT_NEWS + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  strains: {
    url: 'Strain',
    filters: [
      {
        index: 0,
        name: 'Most popular',
        sort: '-reviewCount',
        items: null,
      },
      {
        index: 1,
        name: 'Highest rated',
        sort: '-rating',
        items: null,
      },
      {
        index: 2,
        name: 'New',
        sort: '-createdOn',
        items: null,
      },
    ],
    isLoading: true,
    active: 0,
  },
  accessories: {
    url: { $exists: false },
    filters: [
      {
        index: 0,
        name: 'Most popular',
        sort: '-reviewCount',
        items: null,
      },
      {
        index: 1,
        name: 'Highest rated',
        sort: '-rating',
        items: null,
      },
      {
        index: 2,
        name: 'New',
        sort: '-createdOn',
        items: null,
      },
    ],
    isLoading: true,
    active: 0,
  },
  oils: {
    url: 'Oil',
    filters: [
      {
        index: 0,
        name: 'Most popular',
        sort: '-reviewCount',
        items: null,
      },
      {
        index: 1,
        name: 'Highest rated',
        sort: '-rating',
        items: null,
      },
      {
        index: 2,
        name: 'New',
        sort: '-createdOn',
        items: null,
      },
    ],
    isLoading: true,
    active: 0,
  },
});

export const reducer = (state: State = initialState, { type, payload, meta }: Action) => {
  switch (type) {
    case GET_FILTERABLE_PRODUCTS + REQUESTED:
      return state
        .setIn([meta.category, 'active'], payload);

    case GET_FILTERABLE_PRODUCTS + STARTED:
      return state
        .setIn([meta.category, 'isLoading'], true);

    case GET_FILTERABLE_PRODUCTS + SUCCEDED:
      return state
        .setIn([meta.category, 'isLoading'], false)
        .setIn(
          [meta.category, 'filters', meta.index, 'items'],
          fromJS(payload.data.hits)
        );

    case GET_FILTERABLE_PRODUCTS + FAILED:
      return state
        .setIn([meta.category, 'isLoading'], false);

    case GET_RECENT_NEWS + REQUESTED:
      return state
        .set('isLoading', true);

    case GET_RECENT_NEWS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('news', fromJS(payload));

    case GET_RECENT_NEWS + FAILED:
      return state
        .set('news', payload);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getFilter = (index, category, state) => state.getIn(['home', category, 'filters', index, 'items']);
const getUrl = (index, category, state) => `products?query=${encodeURI(
  { __t: state.getIn(['home', category, 'url']) }
)}&page=1&per_page=4&sort=${state.getIn(['home', category, 'filters', index, 'sort'])}`;

// ------------------------------------
// Sagas
// ------------------------------------
function* FilterableProductsRequest({ payload: index, meta: { category } }) {
  const filterItems = yield select(getFilter.bind(null, index, category));
  const url = yield select(getUrl.bind(null, index, category));
  if (filterItems) {
    yield put(skipFilterableProductsRequest());
  } else {
    try {
      yield put(startFilterableProductsRequest(category));
      const data = yield call(request, { url: `${API_URL}/${url}` });
      yield put(filterableProductsRequestSuccess(category, index, data));
    } catch (error) {
      yield put(filterableProductsRequestFailed(error));
    }
  }
}

function* filterableProductsWatcher(): Generator<Function, void, void> {
  yield takeEvery(GET_FILTERABLE_PRODUCTS + REQUESTED, FilterableProductsRequest);
}

function* RecentNewsRequest() {
  const url = 'https://news.lift.co/wp-json/posts?filter[posts_per_page]=3';
  try {
    const response = yield call(request, { url });
    if (response.status === 200) {
      yield put(recentNewsRequestSuccess(response.data));
    } else {
      yield put(recentNewsRequestFailed(response.data[0].message));
    }
  } catch (error) {
    yield put(recentNewsRequestFailed(error));
  }
}

function* recentNewsRequestWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_RECENT_NEWS + REQUESTED, RecentNewsRequest);
}

export default [
  filterableProductsWatcher,
  recentNewsRequestWatcher,
];
