/* Give a facotry and save some state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 05:30:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-06 23:22:15
 */

const Cimico = require('./libs/cimico');
const utils = require('./libs/utils');

const map = utils.parseEnv(process.env.DEBUG);

const defaults = {
  colors: true,
  pretty: true,
  timestamp: true,
  filename: true
};

function cimico(label, conf = {}) {
  return new Cimico(map, label, Object.assign({},
    defaults, conf));
}

module.exports = cimico;
