// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS } from 'immutable';
import { sortBy } from 'lodash';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, STARTED, SUCCEDED, FAILED } from 'containers/constants';
import type { Action, State } from 'types/common';

// ------------------------------------
// Constants
// ------------------------------------
const GET_REWARDS = 'Lift/RewardsDashboard/GET_REWARDS';
const GET_REDEMPTIONS = 'Lift/RewardsDashboard/GET_REDEMPTIONS';
const UNLOCK_REWARD = 'Lift/RewardsDashboard/UNLOCK_REWARD';
const MARK_AS_REDEEMED = 'Lift/RewardsDashboard/MARK_AS_REDEEMED';

// ------------------------------------
// Actions
// ------------------------------------
export const requestRewards = () => ({
  type: GET_REWARDS + REQUESTED,
});

const rewardsRequestSuccess = (data: Object) => ({
  type: GET_REWARDS + SUCCEDED,
  payload: data,
});
const rewardsRequestFailed = (error) => ({
  type: GET_REWARDS + FAILED,
  payload: error,
});

export const requestRedemptions = () => ({
  type: GET_REDEMPTIONS + REQUESTED,
});

const redemptionsRequestSuccess = (data: Object) => ({
  type: GET_REDEMPTIONS + SUCCEDED,
  payload: data,
});
const redemptionsRequestFailed = (error) => ({
  type: GET_REDEMPTIONS + FAILED,
  payload: error,
});

export const unlockReward = (payload: Object) => ({
  type: UNLOCK_REWARD + REQUESTED,
  payload,
});
const unlockRewardRequestSuccess = (payload: Object) => ({
  type: UNLOCK_REWARD + SUCCEDED,
  payload,
});
const unlockRewardRequestError = (error) => ({
  type: UNLOCK_REWARD + FAILED,
  payload: error,
});

export const markAsRedeemed = (payload: Object) => ({
  type: MARK_AS_REDEEMED + REQUESTED,
  payload,
});
const markAsRedeemedSuccess = (payload: Object) => ({
  type: MARK_AS_REDEEMED + SUCCEDED,
  payload,
});
const markAsRedeemedError = (error) => ({
  type: MARK_AS_REDEEMED + FAILED,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  user: fromJS(storage.get('user')),
  token: storage.get('token'),
  isLoading: false,
  error: '',
});

export const reducer = (state: State = initialState, { type, payload }: Action) => {
  switch (type) {
    case GET_REWARDS + STARTED:
      return state
        .set('isLoading', true);

    case GET_REWARDS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('rewards', fromJS(payload));

    case GET_REWARDS + FAILED:
      return state
        .set('isLoading', false)
        .set('error', `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case GET_REDEMPTIONS + STARTED:
      return state
        .set('isLoading', true);

    case GET_REDEMPTIONS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('redemptions', fromJS(payload));

    case GET_REDEMPTIONS + FAILED:
      return state
        .set('isLoading', false)
        .set('error', `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case UNLOCK_REWARD + STARTED:
      return state
        .set('isLoading', true);

    case UNLOCK_REWARD + SUCCEDED:
      return state
        .set('isLoading', false)
        .setIn(['rewards', 'data'], payload);

    case MARK_AS_REDEEMED + SUCCEDED:
      return state
        .set('isLoading', false);

    case MARK_AS_REDEEMED + FAILED:
      return state
        .set('isLoading', false)
        .set('error', `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getUser = (state) => state.getIn(['app', 'user']);
const getToken = (state) => state.getIn(['app', 'token']);
const getRewards = (state) => state.getIn(['dashboard', 'rewards', 'data']);
// ------------------------------------
// Sagas
// ------------------------------------
function* RewardsRequest() {
  const url = `${API_URL}/rewards`;
  let token = yield select(getToken);
  if (!token) {
    const user = yield select(getUser);
    token = user.get('token');
  }
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = yield call(request, {
      url,
      headers,
    });
    if (response.status === 200) {
      yield put(rewardsRequestSuccess(response));
    } else {
      yield put(rewardsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(rewardsRequestFailed(error));
  }
}

function* RedemptionsRequest() {
  const url = `${API_URL}/rewards/redemptions`;
  const token = yield select(getToken);
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = yield call(request, {
      url,
      headers,
    });
    if (response.status === 200) {
      response.data = sortBy(response.data, ['redeemed']);
      yield put(redemptionsRequestSuccess(response));
    } else {
      yield put(redemptionsRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(redemptionsRequestFailed(error));
  }
}

function* UnlockRewardRequest({ payload }) {
  const url = `${API_URL}/rewards/${payload.get('id')}/redeem`;
  const token = yield select(getToken);
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = yield call(request, {
      method: 'POST',
      url,
      headers,
      data: payload,
    });
    if (response.status === 200) {
      const rewards = yield select(getRewards);
      const newRewards = rewards.filter((r) => r.get('id') !== response.data.reward.id);
      yield put(unlockRewardRequestSuccess(newRewards));
      yield put(requestRedemptions());
    } else {
      yield put(unlockRewardRequestError(response.data.message));
    }
  } catch (error) {
    yield put(unlockRewardRequestError(error));
  }
}

function* MarkAsRedeemedRequest({ payload }) {
  const newPayload = {
    id: payload.get('id', ''),
    redeemed: true,
  };
  const url = `${API_URL}/rewards/redemptions/${payload.get('id')}`;
  const token = yield select(getToken);
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = yield call(request, {
      method: 'PUT',
      url,
      headers,
      data: newPayload,
    });
    if (response.status === 200) {
      yield put(markAsRedeemedSuccess(response));
      yield put(requestRedemptions());
    } else {
      yield put(markAsRedeemedError(response.data.message));
    }
  } catch (error) {
    yield put(markAsRedeemedError(error));
  }
}

function* rewardsWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_REWARDS + REQUESTED, RewardsRequest);
}

function* redemptionsWatcher(): Generator<Function, void, void> {
  yield takeLatest(GET_REDEMPTIONS + REQUESTED, RedemptionsRequest);
}

function* unlockWatcher(): Generator<Function, void, void> {
  yield takeLatest(UNLOCK_REWARD + REQUESTED, UnlockRewardRequest);
}

function* markAsRedeemedWatcher(): Generator<Function, void, void> {
  yield takeLatest(MARK_AS_REDEEMED + REQUESTED, MarkAsRedeemedRequest);
}
export default [
  rewardsWatcher,
  redemptionsWatcher,
  unlockWatcher,
  markAsRedeemedWatcher,
];
