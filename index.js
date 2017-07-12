/* Give a facotry and save some state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 05:30:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 22:04:44
 */

const is = require('is_js');

const Cimico = require('./libs/cimico');
const { enabled } = require('./libs/utils');

const defaults = {
  colors: true,
  pretty: true,
  timestamp: true,
  filename: null,
};

function cimico(label, conf = {}) {
  if (is.not.existy(label) || is.json(label)) {
    const alwaysEnabled = enabled('*');
    return new Cimico('', alwaysEnabled, Object.assign({}, defaults, label || {}));
  }

  const isEnabled = enabled(process.env.CIMICO);
  return new Cimico(label, isEnabled, Object.assign({}, defaults, conf));
}

module.exports = cimico;
