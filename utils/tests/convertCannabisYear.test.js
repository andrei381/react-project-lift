/**
 * Test async injectors
 */

import moment from 'moment';
import { convertCannabisYearToDate, convertDateToCannabisYear } from '../convertCannabisYear';

describe('convertCannabisYearToDate', () => {
  describe('', () => {
    it('given an string value which represents years from 0.5 ~ 10+, should return an ISO format date string', () => {
      const actual = '1/2';
      const currentDate = moment('2016-12-12T20:25:03.099Z');
      const expected = '2016-06-12T20:25:03.099Z';
      expect(convertCannabisYearToDate(actual, currentDate)).toEqual(expected);
    });
  });
  describe('', () => {
    it('given an string value which represents years from 0.5 ~ 10+, should return an ISO format date string', () => {
      const actual = '3';
      const currentDate = moment('2016-12-12T20:25:03.099Z');
      const expected = '2013-12-12T20:25:03.099Z';
      expect(convertCannabisYearToDate(actual, currentDate)).toEqual(expected);
    });
  });
  describe('', () => {
    it('given an string value which represents years from 0.5 ~ 10+, should return an ISO format date string', () => {
      const actual = '10+';
      const currentDate = moment('2016-12-12T20:25:03.099Z');
      const expected = '2006-12-12T20:25:03.099Z';
      expect(convertCannabisYearToDate(actual, currentDate)).toEqual(expected);
    });
  });
});


describe('convertDateToCannabisYear', () => {
  describe('', () => {
    it('given an ISO format date string, should return string value which represents years from 0.5 ~ 10+', () => {
      const currentDate = moment('2016-12-12T20:25:03.099Z');
      const actual = '2016-06-12T20:25:03.099Z';
      const expected = '1/2';
      expect(convertDateToCannabisYear(actual, currentDate)).toEqual(expected);
    });
  });
  describe('', () => {
    it('given an ISO format date string, should return string value which represents years from 0.5 ~ 10+', () => {
      const currentDate = moment('2016-12-12T20:25:03.099Z');
      const actual = '2013-12-12T20:25:03.099Z';
      const expected = '3';
      expect(convertDateToCannabisYear(actual, currentDate)).toEqual(expected);
    });
  });
  describe('', () => {
    it('given an ISO format date string, should return string value which represents years from 0.5 ~ 10+', () => {
      const currentDate = moment('2016-12-12T20:25:03.099Z');
      const actual = '2006-12-12T20:25:03.099Z';
      const expected = '10';
      expect(convertDateToCannabisYear(actual, currentDate)).toEqual(expected);
    });
  });
  describe('', () => {
    it('given an ISO format date string, should return string value which represents years from 0.5 ~ 10+', () => {
      const currentDate = moment('2016-12-12T20:25:03.099Z');
      const actual = null;
      const expected = '';
      expect(convertDateToCannabisYear(actual, currentDate)).toEqual(expected);
    });
  });
});
