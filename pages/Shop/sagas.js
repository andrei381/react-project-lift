// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import request from 'utils/request';
import encodeURI from 'utils/encodeURI';
import { API_URL, REQUESTED, STARTED, SKIPPED, SUCCEDED, FAILED } from 'containers/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const GET_PRODUCTS = 'Lift/Shop/GET_PRODUCTS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestProducts = (category: string) => ({
  type: GET_PRODUCTS + REQUESTED,
  meta: { category },
});
const startProductsRequest = (category: string) => ({
  type: GET_PRODUCTS + STARTED,
  meta: { category },
});
const skipProductsRequest = () => ({
  type: GET_PRODUCTS + SKIPPED,
});
const productsRequestSuccess = (category: string, data: Object) => ({
  type: GET_PRODUCTS + SUCCEDED,
  payload: data,
  meta: {
    category,
  },
});
const productsRequestFailed = (error) => ({
  type: GET_PRODUCTS + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  strains: {
    query: 'Strain',
    items: null,
    isLoading: true,
  },
  accessories: {
    query: { $exists: false },
    items: null,
    isLoading: true,
  },
  oils: {
    query: 'Oil',
    items: null,
    isLoading: true,
  },
});

export const reducer = (state: State = initialState, { type, payload, meta }: Action) => {
  switch (type) {
    case GET_PRODUCTS + STARTED:
      return state
        .setIn([meta.category, 'isLoading'], true);

    case GET_PRODUCTS + SUCCEDED:
      return state
        .setIn([meta.category, 'isLoading'], false)
        .setIn([meta.category, 'items'], fromJS(payload.data.hits ? payload.data.hits : payload.data));

    case GET_PRODUCTS + FAILED:
      return state
        .setIn([meta.category, 'isLoading'], false);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getCategory = (category, state) => state.getIn(['shop', category]);

// ------------------------------------
// Sagas
// ------------------------------------
function* ProductsRequest({ meta: { category } }) {
  const productsCategory = yield select(getCategory.bind(null, category));
  if (productsCategory.get('items')) {
    yield put(skipProductsRequest());
  } else {
    try {
      yield put(startProductsRequest(category));
      const data = yield call(request, { url: `${API_URL}/products?query=${encodeURI({ __t: productsCategory.get('query') })}&page=1&per_page=9` });
      yield put(productsRequestSuccess(category, data));
    } catch (error) {
      yield put(productsRequestFailed(error));
    }
  }
}

function* productsWatcher(): Generator<Function, void, void> {
  yield takeEvery(GET_PRODUCTS + REQUESTED, ProductsRequest);
}

export default [
  productsWatcher,
];
