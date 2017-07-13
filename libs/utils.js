/*
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 01:24:49
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-13 11:56:17
 */

const path = require('path');
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

const getCallInfo = R.curry((base, cs, enabled) => {
  if (enabled === false) {
    return '';
  }
  let filename = cs.getFileName();
  if (base) {
    filename = path.relative(base, filename);
  }
  const fxName = cs.getFunctionName() || cs.getMethodName();
  const line = cs.getLineNumber();
  return `${filename}[${fxName}]:${line}`;
});

function mixConf(config = {}) {
  return Object.assign({}, {
    colors: true,
    pretty: 'none',
    filename: false,
  }, config);
}

module.exports = {
  namespaces,
  enabled,
  isFormatString,
  splitAtFormatters,
  extractFormatters,
  getCallInfo,
  filterEmpty,
  mixConf,
};

// /**
//  * Divide the string into name spaces
//  * Also filter out empty strings
//  *
//  * @param {string} string
//  * @returns {Array(string)}
//  */
// function namespaces(string) {
//   return string.split(/[\s,]/).filter();
// }

// module.exports = {
//   /**
//    * Prase the env string and create a lookup map
//    *
//    * @param {string} string
//    * @returns {object}
//    */
//   parseEnv(string) {
//     const regexps = {
//       enabled: [],
//       disabled: [],
//     };

//     const namespaces = string.split([]);
//   },

//   /**
//    * Check if a log label is enabled
//    *
//    * @param {Object} map
//    * @param {string} label
//    *
//    * @returns {bool}
//    */
//   checkEnabled(map, label) {
//     return lookInMap(map, label.split(':'));
//   },

//   /**
//    * Return a string representation of the call info
//    *
//    * @param {Object} cs
//    * @param {string} base - the base directory to print filename relative to
//    *
//    * @returns {string}
//    */
  // getCallInfo(cs, base) {
  //   let filename = cs.getFileName() || cs.getMethodName();
  //   if (base) {
  //     filename = path.relative(base, filename);
  //   }
  //   return `${filename}[${cs.getFunctionName()}]:${cs.getLineNumber()}`;
  // },

//   /**
//    * Reutrn ISO string of current time
//    *
//    * @returns {string}
//    */
//   getTimeStamp() {
//     return new Date().toISOString();
//   },

//   /**
//    * Inspect format string
//    *
//    * @return {object}
//    */
//   inspectFormat(string) {
//     const re = /%([budsi]*)(\((.*)\))?/;
//     const match = string.match(re);

//     return {
//       formatters: match[1] ? match[1].split('') : [],
//       key: match[3] ? match[3] : null,
//     };
//   },
// };
