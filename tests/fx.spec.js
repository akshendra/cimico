/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 18:19:13
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-06 18:28:54
 */

const cimico = require('../fx');

const logger = cimico('app', {
  pretty: false,
  colors: true,
  format: false,
});

console.log(logger.pretty().format().level(true));