/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 18:04:29
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-06 18:35:33
 */

const R = require('ramda');

module.exports = {
  pretty: R.curry((value, config) => config.set('pretty', value)),

  format: R.curry((value, config) => config.set('format', value)),

  colors: R.curry((value, config) => config.get('colors', value)),

  level: R.curry((value, config) => config.set('level', value)),
};
