/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 17:54:56
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-06 18:35:01
 */

const {
  Map,
} = require('immutable');

const Logger = require('./libs/logger');
const options = require('./libs/options');

module.exports = function cimico(name, config) {
  const configMap = Map(Object.assign({}, config, {
    name
  }));
  const logger = Logger.of(configMap);

  Object.keys(options).forEach((option) => {
    const fx = options[option];
    logger[option] = function mapper(value) {
      return logger.map(fx(value));
    };
  });

  return logger;
};
