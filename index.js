/* Give a facotry and save some state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 05:30:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 18:01:52
 */

const is = require('is_js');

const Cimico = require('./libs/cimico');
const utils = require('./libs/utils');

const map = utils.parseEnv(process.env.DEBUG);

const defaults = {
  colors: true,
  pretty: true,
  timestamp: true,
  filename: null,
};

function cimico(label, conf = {}) {
  if (is.not.existy(label) || is.json(label)) {
    return new Cimico(utils.parseEnv(''), '', Object.assign({}, defaults, label || {}));
  }

  return new Cimico(map, label, Object.assign({},
    defaults, conf));
}

module.exports = cimico;
