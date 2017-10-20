// @flow

import createReducer from 'reducers';
import type { Store } from 'types/common';

/**
 * Inject an asynchronously loaded reducer
 */
export function injectAsyncReducer(store: Store) {
  return function injectReducer(name: string, asyncReducer: Function) {
    if (name in store.asyncReducers) return;

    store.asyncReducers[name] = asyncReducer; // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.asyncReducers));
  };
}

/**
 * Inject an asynchronously loaded saga
 */
export function injectAsyncSagas(store: Store) {
  return function injectSagas(sagas: [Function]) {
    // return redux-saga Tasks, so they can be canceled on router events
    return sagas.forEach((saga) => {
      if (!Reflect.has(store.asyncSagas, saga)) {
        store.asyncSagas[saga] = true; // eslint-disable-line no-param-reassign
        store.runSaga(saga);
      }
    });
  };
}

/**
 * Helper for creating injectors
 */
export function getAsyncInjectors(store: Store) {
  return {
    injectReducer: injectAsyncReducer(store),
    injectSagas: injectAsyncSagas(store),
  };
}
