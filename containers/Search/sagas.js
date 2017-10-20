// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { stringify } from 'qs';
import { EventTypes } from 'redux-segment';
import request from 'utils/request';
import deepReplace from 'utils/deepReplace';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, STARTED, SKIPPED, SUCCEDED, FAILED, FILTER_SHOW_OPTIONS } from 'containers/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const GET_FILTERS = 'Lift/Search/GET_FILTERS';
const GET_PRODUCTS = 'Lift/Search/GET_PRODUCTS';
const RESET_QUERY = 'Lift/Search/RESET_QUERY';
// ------------------------------------
// Actions
// ------------------------------------
export const requestFilters = (category: string) => ({
  type: GET_FILTERS + REQUESTED,
  meta: { category },
});
const startFiltersRequest = (category) => ({
  type: GET_FILTERS + STARTED,
  meta: { category },
});
const skipFiltersRequest = () => ({
  type: GET_FILTERS + SKIPPED,
});
const filtersRequestSuccess = (category: string, data: Object) => ({
  type: GET_FILTERS + SUCCEDED,
  payload: data,
  meta: { category },
});
const filtersRequestFailed = (category: string, error: string) => ({
  type: GET_FILTERS + FAILED,
  payload: error,
  meta: { category },
});

export const requestProducts = (category: string, path: string, value: Object) => ({
  type: GET_PRODUCTS + REQUESTED,
  payload: value,
  meta: {
    category,
    path,
  },
});
const productsRequestSuccess = (category: string, keyword: string, data: Object) => ({
  type: GET_PRODUCTS + SUCCEDED,
  payload: data,
  meta: {
    category,
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        event: 'product-search',
        properties: {
          category,
          keyword,
        },
      },
    },
  },
});
const productsRequestFailed = (category: string, error: string) => ({
  type: GET_PRODUCTS + FAILED,
  payload: error,
  meta: { category },
});

export const resetQuery = (category: string) => ({
  type: RESET_QUERY,
  payload: category,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  Strain: {
    filter: {
      data: {},
      isLoading: true,
      model: {
        page: 1,
        per_page: FILTER_SHOW_OPTIONS[0],
      },
      query: {
        __t: 'Strain',
      },
    },
    data: {},
    isLoading: true,
  },
  Oil: {
    filter: {
      data: {},
      isLoading: true,
      model: {
        page: 1,
        per_page: FILTER_SHOW_OPTIONS[0],
      },
      query: {
        __t: 'Oil',
      },
    },
    data: {},
    isLoading: true,
  },
  Product: {
    filter: {
      data: {},
      isLoading: true,
      model: {
        page: 1,
        per_page: FILTER_SHOW_OPTIONS[0],
      },
      query: {
        __t: { $exists: false },
      },
    },
    data: {},
    isLoading: true,
  },
});

let newState = {};

export const reducer = (state: State = initialState, { type, payload, meta }: Action) => {
  switch (type) {
    case GET_FILTERS + STARTED:
      return state
        .setIn([meta.category, 'filter', 'isLoading'], true);

    case GET_FILTERS + SUCCEDED:
      return state
        .setIn([meta.category, 'filter', 'isLoading'], false)
        .setIn(
          [meta.category, 'filter', 'data'], fromJS(payload.data[meta.category]));

    case GET_FILTERS + FAILED:
      return state
        .setIn([meta.category, 'filter', 'isLoading'], false);


    case GET_PRODUCTS + REQUESTED:

      newState = state.setIn([meta.category, 'isLoading'], true);

      if (meta.path) {
        if (payload && payload.length === 0) {
          return newState.deleteIn([meta.category, 'filter', ...meta.path]);
        }
        return newState.setIn([meta.category, 'filter', ...meta.path], fromJS(payload));
      }
      return newState;

    case GET_PRODUCTS + SUCCEDED:
      return state
        .setIn([meta.category, 'isLoading'], false)
        .setIn([meta.category, 'data'], fromJS(payload.data));

    case GET_PRODUCTS + FAILED:
      return state
        .setIn([meta.category, 'isLoading'], false);

    case RESET_QUERY:
      if (payload === 'Product') {
        return state.setIn([payload, 'filter', 'query'], fromJS({
          __t: { $exists: false },
        }));
      }
      return state.setIn([payload, 'filter', 'query'], fromJS({
        __t: payload,
      }));

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getFilter = (category, state) => state.getIn(['search', category, 'filter', 'data']);
const getModel = (category, state) => deepReplace(state.getIn(['search', category, 'filter', 'model']).toJS());
const getQuery = (category, state) => deepReplace(state.getIn(['search', category, 'filter', 'query']).toJS());

// ------------------------------------
// Sagas
// ------------------------------------
function* FiltersRequest({ meta: { category } }) {
  const filter = yield select(getFilter.bind(null, category));
  if (filter.length) {
    yield put(skipFiltersRequest());
  } else {
    try {
      yield put(startFiltersRequest(category));
      const data = yield call(request, { url: `${API_URL}/products/filters` });
      yield put(filtersRequestSuccess(category, data));
    } catch (error) {
      yield put(filtersRequestFailed(category, error));
    }
  }
}

function* filtersWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_FILTERS + REQUESTED, FiltersRequest);
}

function* ProductsRequest({ meta: { category } }) {
  const model = yield select(getModel.bind(null, category));
  const query = yield select(getQuery.bind(null, category));
  const { q, type } = query;
  if (q) {
    query.$text = { $search: q };
  }
  if (type) {
    query.category = type;
  }
  delete query.q;
  delete query.type;
  try {
    const data = yield call(request, {
      url: `${API_URL}/products?${stringify(model)}&query=${encodeURI(query)}`,
    });
    yield put(productsRequestSuccess(category, query.$text, data));
  } catch (error) {
    yield put(productsRequestFailed(category, error));
  }
}

function* productsWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_PRODUCTS + REQUESTED, ProductsRequest);
}

function* ResetQueryRequest({ payload }) {
  yield put(requestProducts(payload, '', {}));
}

function* resetQueryWatcher(): Generator<Function, void, void> {
  yield takeLatest(RESET_QUERY, ResetQueryRequest);
}

export default [
  filtersWatcher,
  productsWatcher,
  resetQueryWatcher,
];
