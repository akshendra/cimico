/* Give a facotry and save some state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 05:30:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-22 20:57:39
 */

const callsites = require('callsites');

const Cimico = require('./src/cimico');
const utils = require('./src/utils');

const map = utils.parseEnv(process.env.DEBUG);
const supportedFlags = ['format', 'color', 'pretty', 'filename', 'timestamp'];
const supportedMethods = ['log', 'error', 'success', 'debug'];

const shortHands = {
  f: 'format',
  c: 'color',
  p: 'pretty',
  l: 'log',
  e: 'error',
  d: 'debug',
  s: 'success',
  fn: 'filename',
  ts: 'timestamp',
};

const defaults = {
  format: false,
  color: true,
  pretty: true,
  timestamp: false,
  filename: true,
};

function cimico(label, conf = {}) {
  const baseDir = callsites()[1].getFileName();

  const logger = new Cimico(
    map,
    label,
    Object.assign(
      {
        baseDir,
      },
      defaults,
      conf,
    ),
  );

  const proxy = new Proxy(logger, {
    get(target, k) {
      const key = shortHands[k] || k;
      if (supportedFlags.indexOf(key) !== -1) {
        target.setFlag(key);
        return proxy;
      }
      if (supportedMethods.indexOf(key) !== -1) {
        return target[key].bind(target);
      }

      return target[key];
    },
  });
  return proxy;
}

module.exports = cimico;
