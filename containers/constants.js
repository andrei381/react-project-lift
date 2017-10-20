import yup from 'yup';

export const USERNAME_MIN_CHAR = 2;
export const USERNAME_MAX_CHAR = 30;

export const USERNAME_SCHEMA = yup
  .string()
  .min(USERNAME_MIN_CHAR, `minimum username length is ${USERNAME_MIN_CHAR} characters`)
  .max(USERNAME_MAX_CHAR, `max password length is ${USERNAME_MAX_CHAR} characters`)
  .matches(/^[a-zA-Z0-9 ]+$/, 'username can be only alphanumeric and spaces, should not contain other symbols, emojis or characters in other languages')
  .required();

export const API_URL = process.env.NODE_ENV === 'production' ?
  'https://deploy.lift.co/api/v2' :
  'https://staging.lift.co/api/v2';

export const REQUESTED = '_REQUESTED';
export const SUCCEDED = '_SUCCEDED';
export const STARTED = '_STARTED';
export const SKIPPED = '_SKIPPED';
export const FAILED = '_FAILED';
export const ERROR = '_ERROR';
export const INTERCOM_APP_ID = 'pjt9b0cn';

export const FILTER_SHOW_OPTIONS = [
  {
    label: '8',
    value: 8,
  },
  {
    label: '16',
    value: 16,
  },
  {
    label: '32',
    value: 32,
  },
];
export const DEFAULT_LAT = 63;
export const DEFAULT_LONG = -100;

export const FILTER_SORT_OPTIONS = [
  {
    label: 'Most popular',
    value: '-rating',
  }, {
    label: 'Least popular',
    value: 'rating',
  }, {
    label: 'Most recent',
    value: 'createdOn',
  }, {
    label: 'Least recent',
    value: '-createdOn',
  }, {
    label: 'Most expensive',
    value: '-price',
  }, {
    label: 'Least expensive',
    value: 'price',
  }, {
    label: 'Highest CBD',
    value: '-cbdHigh',
  }, {
    label: 'Highest THC',
    value: '-cbdHigh',
  },
];

export const BUSINESS_FILTER_SORT_OPTIONS = [
  {
    label: 'Highest Rated',
    value: '-rating',
  }, {
    label: 'Lowest Rated',
    value: 'rating',
  },
];

export const QUESTIONS_FILTER_SORT_OPTIONS = [
  {
    label: 'Most recent',
    value: '-createdOn',
  }, {
    label: 'Least recent',
    value: 'createdOn',
  }, {
    label: 'Most Answers',
    value: '-answers.count',
  }, {
    label: 'Most Views',
    value: '-views',
  },
];

export const FILTER_PROVINCE_OPTIONS = [
  {
    label: 'All Provinces',
    value: '',
    center: {
      lat: 63,
      lng: -100,
      zoom: 3,
    },
  }, {
    label: 'Alberta',
    value: 'Alberta',
    center: {
      lat: 51.75,
      lng: -112.95,
      zoom: 6,
    },
  }, {
    label: 'British Columbia',
    value: 'British Columbia',
    center: {
      lat: 53.56,
      lng: -125.31,
      zoom: 5,
    },
  }, {
    label: 'Labrador',
    value: 'Labrador',
    center: {
      lat: 53.98,
      lng: -61.99,
      zoom: 6,
    },
  }, {
    label: 'Manitoba',
    value: 'Manitoba',
    center: {
      lat: 51.75,
      lng: -98.62,
      zoom: 6,
    },
  }, {
    label: 'New Brunswick',
    value: 'New Brunswick',
    center: {
      lat: 46.48,
      lng: -66.15,
      zoom: 7,
    },
  }, {
    label: 'Newfoundland',
    value: 'Newfoundland',
    center: {
      lat: 49,
      lng: -55.53,
      zoom: 6,
    },
  }, {
    label: 'Nova Scotia',
    value: 'Nova Scotia',
    center: {
      lat: 45.12,
      lng: -63.29,
      zoom: 7,
    },
  }, {
    label: 'Nunavut',
    value: 'Nunavut',
    center: {
      lat: 67.6,
      lng: -80.2,
      zoom: 4,
    },
  }, {
    label: 'Northwest Territories',
    value: 'Northwest Territories',
    center: {
      lat: 64.26,
      lng: -116.87,
      zoom: 5,
    },
  }, {
    label: 'Ontario',
    value: 'Ontario',
    center: {
      lat: 44.73,
      lng: -78.32,
      zoom: 6,
    },
  }, {
    label: 'Prince Edward Island',
    value: 'Prince Edward Island',
    center: {
      lat: 46.46,
      lng: -63.36,
      zoom: 8,
    },
  }, {
    label: 'Quebec',
    value: 'Quebec',
    center: {
      lat: 46.57,
      lng: -73.56,
      zoom: 7,
    },
  }, {
    label: 'Saskatchewan',
    value: 'Saskatchewan',
    center: {
      lat: 51.75,
      lng: -105.39,
      zoom: 6,
    },
  }, {
    label: 'Yukon',
    value: 'Yukon',
    center: {
      lat: 63.99,
      lng: -135.15,
      zoom: 5,
    },
  },
];

export const CANNABIS_USAGE_PERIOD_OPTIONS = [
  {
    label: '1/2',
    value: '1/2',
  }, {
    label: '1',
    value: '1',
  }, {
    label: '2',
    value: '2',
  }, {
    label: '3',
    value: '3',
  }, {
    label: '4',
    value: '4',
  }, {
    label: '5',
    value: '5',
  }, {
    label: '6',
    value: '6',
  }, {
    label: '7',
    value: '7',
  }, {
    label: '8',
    value: '8',
  }, {
    label: '9',
    value: '9',
  }, {
    label: '10+',
    value: '10',
  },
];

export const REVIEW_SORT_OPTIONS = [
  {
    label: 'Latest',
    value: '-createdOn',
  }, {
    label: 'Oldest',
    value: 'createdOn',
  },
  {
    label: 'Ratings Best To Worst',
    value: '-rating',
  }, {
    label: 'Ratings Worst To Best',
    value: 'rating',
  },
];

export const COMMENT_SORT_OPTIONS = [
  {
    label: 'Latest',
    value: '-createdOn',
  }, {
    label: 'Oldest',
    value: 'createdOn',
  },
];

export const STRAIN_TYPE_OPTIONS = [
  {
    label: 'All',
    value: '',
  }, {
    label: 'Sativa',
    value: 'sativa',
  }, {
    label: 'Indica',
    value: 'indica',
  }, {
    label: 'Hybrid',
    value: 'hybrid',
  },
];
