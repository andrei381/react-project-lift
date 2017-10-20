import moment from 'moment';

export const convertCannabisYearToDate = (year, current = moment()) => {
  if (year === '1/2') {
    return current.subtract(0.5, 'years').toISOString();
  } else if (year === '10+') {
    return current.subtract(10, 'years').toISOString();
  }
  return current.subtract(parseInt(year, 10), 'years').toISOString();
};

export const convertDateToCannabisYear = (date, current = moment()) => {
  if (date) {
    if (current.diff(moment(date), 'years') === 0) {
      return '1/2';
    }
    return current.diff(moment(date), 'years').toString();
  }
  return '';
};
