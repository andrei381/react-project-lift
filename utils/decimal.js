// @flow

const regex = /([0-9]{1,2})+\.([1-9])([0-9])?/ig;
export default (text) => text ? text.replace(regex, '$1.$2') : 'N/A';
