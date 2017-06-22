/* Give a facotry and save some state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 05:30:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-22 05:35:30
 */

const Cimico = require('./src/cimico');
const utils = require('./src/utils');

const map = utils.parseEnv(process.env.DEBUG);

function cimico(label, conf = {}) {
  const logger = new Cimico(map, label, conf);
  return logger;
}

module.exports = cimico;
