/* Give a facotry and save some state
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 05:30:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-06 16:53:50
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
  ts: 'timestamp'
};

const defaults = {
  format: false,
  color: true,
  pretty: true,
  timestamp: false,
  filename: true
};

const defLog = new Cimico({}, '', {
  format: false,
  color: true,
  pretty: true,
  timestamp: false,
  filename: false
});

Object.assign(defLog.enabled, {
  log: true,
  success: true,
  error: true,
  debug: true
});

function proxyLogger(logger) {
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
    }
  });
  return proxy;
}

const loggers = {};

function cimico(label, conf = {}) {
  const baseDir = callsites()[1].getFileName();

  if (!label) {
    Object.assign(defLog.config, {
      baseDir
    });
    return proxyLogger(defLog);
  }

  if (label instanceof Object) {
    Object.assign(
      defLog.config,
      Object.assign({
          baseDir
        },
        label
      )
    );
    return proxyLogger(defLog);
  }

  if (loggers[label]) {
    const logger = loggers[label];
    if (conf) {
      logger.config = conf;
    }
    return logger;
  }

  const logger = new Cimico(
    map,
    label,
    Object.assign({
        baseDir
      },
      defaults,
      conf
    )
  );
  loggers[label] = proxyLogger(logger);
  return loggers[label];
}

module.exports = cimico;
