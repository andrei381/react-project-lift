// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS, List } from 'immutable';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { EventTypes } from 'redux-segment';
import moment from 'moment';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'containers/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import type { Action, State } from 'types/common';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const REGISTER = 'Lift/App/REGISTER';
const LOGIN = 'Lift/App/LOGIN';
const LOGOUT = 'Lift/App/LOGOUT';
const USER = 'Lift/App/USER';
const REWARDS_REGISTRATION = 'Lift/App/REWARDS_REGISTRATION';
const USER_DATA_UPDATE = 'Lift/App/UPDATE_USER_DATA';

const OPEN_CART = 'Lift/App/OPEN_CART';
const CLOSE_CART = 'Lift/App/CLOSE_CART';
const UPDATE_CART = 'Lift/App/UPDATE_CART';
const ADD_PRODUCT = 'Lift/App/Track/ADD_PRODUCT';
const REMOVE_PRODUCT = 'Lift/App/Track/REMOVE_PRODUCT';
const CHECKOUT_CART = 'Lift/App/Track/CHECKOUT_CART';

const USER_PHOTO_UPLOAD = 'Lift/App/UPLOAD_USER_PHOTO';
const SET_PROFILE_BREADCRUMB_PATH = 'Lift/App/SET_PROFILE_BREADCRUMB_PATH';

const OPEN_NAVBAR = 'Lift/App/OPEN_NAVBAR';
const CLOSE_NAVBAR = 'Lift/App/CLOSE_NAVBAR';

const GO_PAGE_STEP1 = 'Lift/App/Track/GO_PAGE_STEP1';
const SET_META_JSON = 'Lift/App/SET_META_JSON';

// ------------------------------------
// Actions
// ------------------------------------
export const requestRegister = (payload: Object) => ({
  type: REGISTER + REQUESTED,
  payload,
});
const registerRequestSuccess = (payload: Object) => ({
  type: REGISTER + SUCCEDED,
  payload,
  meta: {
    analytics: [
      {
        eventType: EventTypes.track,
        eventPayload: {
          event: 'user-registered',
          properties: {
            userData: payload,
          },
        },
      },
      {
        eventType: EventTypes.identify,
        eventPayload: {
          traits: {
            name: payload.username,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            gender: payload.gender,
            avatar: payload.gravatarPicture,
            createdAt: moment(payload.createdOn).toDate(),
            birthday: moment(payload.birthday).toDate(),
            description: payload.bio,
            age: moment().diff(moment(payload.birthday), 'years'),
          },
          userId: payload.id,
        },
      },
    ],
  },
});
const registerRequestFailed = (error) => ({
  type: REGISTER + FAILED,
  payload: error,
});
const registerRequestError = (error) => ({
  type: REGISTER + ERROR,
  payload: error,
});

export const requestUserDataUpdate = (payload: Object) => ({
  type: USER_DATA_UPDATE + REQUESTED,
  payload,
});
const userDataUpdateSuccess = (payload: Object) => ({
  type: USER_DATA_UPDATE + SUCCEDED,
  payload,
});
const userDataUpdateFailed = (error) => ({
  type: USER_DATA_UPDATE + FAILED,
  payload: error,
});
const userDataUpdateError = (error) => ({
  type: USER_DATA_UPDATE + ERROR,
  payload: error,
});

export const requestUserPhotoUpload = (payload: Object) => ({
  type: USER_PHOTO_UPLOAD + REQUESTED,
  payload,
});
const userPhotoUploadSuccess = (payload: Object) => ({
  type: USER_PHOTO_UPLOAD + SUCCEDED,
  payload,
});
const userPhotoUploadFailed = (error) => ({
  type: USER_PHOTO_UPLOAD + FAILED,
  payload: error,
});
const userPhotoUploadError = (error) => ({
  type: USER_PHOTO_UPLOAD + ERROR,
  payload: error,
});

export const requestLogin = (payload: Object) => ({
  type: LOGIN + REQUESTED,
  payload,
});
const loginRequestSuccess = (payload: Object) => ({
  type: LOGIN + SUCCEDED,
  payload,
  meta: {
    analytics: [
      {
        eventType: EventTypes.identify,
        eventPayload: {
          traits: {
            name: payload.username,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            gender: payload.gender,
            avatar: payload.gravatarPicture,
            createdAt: moment(payload.createdOn).toDate(),
            birthday: moment(payload.birthday).toDate(),
            description: payload.bio,
            age: moment().diff(moment(payload.birthday), 'years'),
          },
          userId: payload.id,
        },
      },
    ],
  },
});
const loginRequestFailed = (error) => ({
  type: LOGIN + FAILED,
  payload: error,
});
const loginRequestError = (error) => ({
  type: LOGIN + ERROR,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const requestUser = () => ({
  type: USER + REQUESTED,
});
const userRequestSuccess = (payload: Object) => ({
  type: USER + SUCCEDED,
  payload,
  meta: {
    analytics: {
      eventType: EventTypes.identify,
      eventPayload: {
        traits: {
          name: payload.username,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          gender: payload.gender,
          avatar: payload.gravatarPicture,
          createdAt: moment(payload.createdOn).toDate(),
          birthday: moment(payload.birthday).toDate(),
          description: payload.bio,
          age: moment().diff(moment(payload.birthday), 'years'),
        },
        userId: payload.id,
      },
    },
  },
});
const userRequestFailed = (error) => ({
  type: USER + FAILED,
  payload: error,
});
const userRequestError = (error) => ({
  type: USER + ERROR,
  payload: error,
});

export const requestRewardsRegistration = (payload: Object) => ({
  type: REWARDS_REGISTRATION + REQUESTED,
  payload,
});
const registerRewardsSuccess = (payload: Object) => ({
  type: REWARDS_REGISTRATION + SUCCEDED,
  payload,
});
const registerRewardsError = (error) => ({
  type: REWARDS_REGISTRATION + FAILED,
  payload: error,
});

export const openCart = () => ({
  type: OPEN_CART,
  meta: {
    analytics: [
      {
        eventType: EventTypes.track,
        eventPayload: {
          event: 'shoppingcart-open',
        },
      },
    ],
  },
});
export const closeCart = () => ({
  type: CLOSE_CART,
  meta: {
    analytics: [
      {
        eventType: EventTypes.track,
        eventPayload: {
          event: 'shoppingcart-close',
        },
      },
    ],
  },
});

export const updateCart = (itemCount: number) => ({
  type: UPDATE_CART,
  payload: itemCount,
});

export const trackAddProduct = (product: string) => ({
  type: ADD_PRODUCT,
  meta: {
    analytics: [
      {
        eventType: EventTypes.track,
        eventPayload: {
          event: 'shoppingcart-add-product',
          properties: {
            product,
          },
        },
      },
    ],
  },
});

export const trackRemoveProduct = (product: string) => ({
  type: REMOVE_PRODUCT,
  meta: {
    analytics: [
      {
        eventType: EventTypes.track,
        eventPayload: {
          event: 'shoppingcart-remove-product',
          properties: {
            product,
          },
        },
      },
    ],
  },
});

export const trackCheckout = () => ({
  type: CHECKOUT_CART,
  meta: {
    analytics: [
      {
        eventType: EventTypes.track,
        eventPayload: {
          event: 'shoppingcart-checkout',
        },
      },
    ],
  },
});

export const setProfileBreadcrumbPath = (path: List<Map<string, Object>>) => ({
  type: SET_PROFILE_BREADCRUMB_PATH,
  payload: path,
});

export const openNavbar = () => ({
  type: OPEN_NAVBAR,
});

export const closeNavbar = () => ({
  type: CLOSE_NAVBAR,
});

export const setMetaJson = (path: string, value: ?Object) => ({
  type: SET_META_JSON,
  payload: value,
  meta: {
    path,
  },
});

export const trackGoStep1 = () => ({
  type: GO_PAGE_STEP1,
  meta: {
    analytics: [
      {
        eventType: EventTypes.track,
        eventPayload: {
          event: 'go-page-step1',
        },
      },
    ],
  },
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  user: fromJS(storage.get('user')),
  token: storage.get('token'),
  isLoading: false,
  error: '',
  cart: fromJS({
    open: false,
    itemCount: null,
  }),
  uploadedPhoto: '',
  isUploading: false,
  profileBreadcrumbPath: null,
  navbarOpen: false,
  metaJson: {},
});

export const reducer = (state: State = initialState, { type, payload, meta }: Action) => {
  switch (type) {
    case REGISTER + REQUESTED:
      return state
        .set('isLoading', true)
        .set('error', null);

    case REGISTER + SUCCEDED:
      storage.set('user', payload);
      storage.set('token', payload.token);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('token', payload.token)
        .set('error', '');

    case REGISTER + FAILED:
      return state
        .set('isLoading', false)
        .set('error', payload);

    case REGISTER + ERROR:
      return state
        .set('isLoading', false)
        .set('error', `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case USER_DATA_UPDATE + REQUESTED:
      return state
        .set('isLoading', true)
        .set('error', null);

    case USER_DATA_UPDATE + SUCCEDED:
      storage.set('user', payload);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('error', '');

    case USER_DATA_UPDATE + FAILED:
      return state
        .set('isLoading', false)
        .set('error', payload);

    case USER_DATA_UPDATE + ERROR:
      return state
        .set('isLoading', false)
        .set('error', `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case USER_PHOTO_UPLOAD + REQUESTED:
      return state
        .set('isUploading', true)
        .set('error', null);

    case USER_PHOTO_UPLOAD + SUCCEDED:
      return state
        .set('isUploading', false)
        .set('uploadedPhoto', fromJS(payload).get('link'))
        .set('error', '');

    case USER_PHOTO_UPLOAD + FAILED:
      return state
        .set('isUploading', false)
        .set('error', payload);

    case USER_PHOTO_UPLOAD + ERROR:
      return state
        .set('isUploading', false)
        .set('error', `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case LOGIN + REQUESTED:
      return state
        .set('isLoading', true);

    case LOGIN + SUCCEDED:
      storage.set('token', payload.token);
      return state
        .set('isLoading', false)
        .set('token', payload.token)
        .set('error', '');

    case LOGIN + FAILED:
      return state
        .set('isLoading', false)
        .set('error', payload);

    case LOGIN + ERROR:
      return state
        .set('isLoading', false)
        .set('error', `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`);

    case LOGOUT:
      storage.remove('token');
      storage.remove('user');
      window.Intercom('shutdown');
      return state
        .set('user', null)
        .set('token', null);

    case USER + REQUESTED:
      return state
        .set('isLoading', true);

    case USER + SUCCEDED:
      storage.set('user', payload);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('error', '');

    case USER + FAILED:
      return state
        .set('isLoading', false)
        .set('error', payload);

    case USER + ERROR:
      return state
        .set('isLoading', false);

    case REWARDS_REGISTRATION + REQUESTED:
      return state
        .set('isLoading', true);

    case REWARDS_REGISTRATION + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('error', '');

    case REWARDS_REGISTRATION + ERROR:
      return state
        .set('isLoading', false)
        .set('error', payload);

    case OPEN_CART:
      return state
        .setIn(['cart', 'open'], true);

    case CLOSE_CART:
      return state
        .setIn(['cart', 'open'], false);

    case UPDATE_CART:
      return state
        .setIn(['cart', 'itemCount'], payload);

    case SET_PROFILE_BREADCRUMB_PATH:
      return state
        .set('profileBreadcrumbPath', payload);

    case OPEN_NAVBAR:
      return state
        .set('navbarOpen', true);

    case CLOSE_NAVBAR:
      return state
        .set('navbarOpen', false);

    case SET_META_JSON:
      if (meta.path) return state.setIn(['metaJson', ...meta.path], fromJS(payload));
      return state
        .set('metaJson', fromJS(payload));

    case LOCATION_CHANGE:
      return state
        .set('metaJson', fromJS({}));

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------
const getUser = (state) => state.getIn(['app', 'user']);

// ------------------------------------
// Sagas
// ------------------------------------
function* RegisterRewardsRequest({ payload }) {
  const url = `${API_URL}/rewards/register`;

  const user = yield select(getUser);
  if (user) {
    yield put(requestUserDataUpdate(payload));
  } else {
    yield RegisterRequest({ payload });
  }

  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url,
      data: { rewardsActivationCode: payload.rewardsActivationCode.replace(/-|\s/g, '') },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(registerRewardsSuccess(response.data));
    } else {
      yield put(registerRewardsError(response.error.message));
    }
  } catch (error) {
    yield put(registerRewardsError(error));
  }
}
function* registerRewardsWatcher(): Generator<Function, void, void> {
  yield takeLatest(REWARDS_REGISTRATION + REQUESTED, RegisterRewardsRequest);
}

function* UpdateUserDataRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/users/me`,
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(userDataUpdateSuccess(response.data));
    } else {
      yield put(userDataUpdateFailed(response.data.message));
    }
  } catch (error) {
    yield put(userDataUpdateError(error));
  }
}
function* userDataUpdateWatcher(): Generator<Function, void, void> {
  yield takeLatest(USER_DATA_UPDATE + REQUESTED, UpdateUserDataRequest);
}

function* UploadUserPhotoRequest({ payload }) {
  const formData = new FormData();
  formData.append('photo', payload);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/photos`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.status === 200) {
      yield put(userPhotoUploadSuccess(response.data));
      yield put(requestUserDataUpdate({ picture: response.data.link }));
    } else {
      yield put(userPhotoUploadFailed(response.data.message));
    }
  } catch (error) {
    yield put(userPhotoUploadError(error));
  }
}
function* userPhotoUploadWatcher(): Generator<Function, void, void> {
  yield takeLatest(USER_PHOTO_UPLOAD + REQUESTED, UploadUserPhotoRequest);
}

function* RegisterRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/users/register`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(registerRequestSuccess(response.data));
    } else {
      yield put(registerRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(registerRequestError(error));
  }
}
function* registerWatcher(): Generator<Function, void, void> {
  yield takeLatest(REGISTER + REQUESTED, RegisterRequest);
}

function* LoginRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(loginRequestSuccess(response.data));
      yield put(requestUser());
    } else {
      yield put(loginRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(loginRequestError(error));
  }
}
function* loginWatcher(): Generator<Function, void, void> {
  yield takeLatest(LOGIN + REQUESTED, LoginRequest);
}

function* UserRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      url: `${API_URL}/users/me?populate=pointWallet`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      yield put(userRequestSuccess(response.data));
    } else {
      yield put(userRequestFailed(response.data.message));
    }
  } catch (error) {
    yield put(userRequestError(error));
  }
}
function* userWatcher(): Generator<Function, void, void> {
  yield takeLatest(USER + REQUESTED, UserRequest);
}

export default [
  registerWatcher,
  userDataUpdateWatcher,
  loginWatcher,
  userWatcher,
  registerRewardsWatcher,
  userPhotoUploadWatcher,
];
