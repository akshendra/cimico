/*
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 01:24:49
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 22:03:14
 */

const is = require('is_js');
const R = require('ramda');

const regexTest = R.curry((exp, string) => {
  const regex = new RegExp(exp);
  return regex.test(string);
});

const splitAtSpaceOrComma = R.split(/[\s,]+/);
const filterEmpty = R.filter(v => (is.existy(v) && is.not.empty(v)));
const replaceStar = R.replace(/\*/g, '.*?');
const namespaces = R.compose(R.map(replaceStar), filterEmpty, splitAtSpaceOrComma);
const negative = R.compose(R.equals('-'), R.head);
const positive = R.complement(negative);
const removeMinus = v => v.substr(1);

const makeRegex = ns => `^${ns}$`;
const regexMapper = R.compose(regexTest, makeRegex);
const allowedRegex = R.compose(R.map(regexMapper), R.filter(positive), namespaces);
const rejectedRegex = R.compose(R.map(R.compose(regexMapper, removeMinus)), R.filter(negative), namespaces);
const enabled = (string = '') => {
  return R.both(R.anyPass(allowedRegex(string)), R.complement(R.anyPass(rejectedRegex(string))));
};

const formatter = /%[bu]+/g;
const isFormatString = regexTest(formatter);
const splitAtFormatters = R.split(formatter);
const extractFormatters = str => {
  return str.match(formatter);
};

module.exports = {
  namespaces,
  enabled,
  isFormatString,
  splitAtFormatters,
  extractFormatters,
};
