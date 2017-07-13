/* Give a facotry and save some state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 05:30:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-13 11:58:08
 */

const is = require('is_js');

const Cimico = require('./libs/cimico');
const { enabled, mixConf } = require('./libs/utils');

const cache = {
  _: null,
};

function cimico(label, conf = {}) {
  if (is.not.existy(label) || is.json(label)) {
    if (is.null(cache._)) {
      const alwaysEnabled = enabled('*');
      cache._ = new Cimico('', alwaysEnabled, mixConf(label));
    } else if (is.json(label)) {
      cache._.config = mixConf(label);
    }
    return cache._;
  }

  const isEnabled = enabled(process.env.CIMICO);
  if (cache[label]) {
    if (is.existy(conf)) {
      cache[label].config = mixConf(conf);
    }
  } else {
    cache[label] = new Cimico(label, isEnabled, mixConf(conf));
  }
  return cache[label];
}

module.exports = cimico;
