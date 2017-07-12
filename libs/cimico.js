/**
 * Logger module
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 02:07:58
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 23:45:21
 */

const callsites = require('callsites');

const levels = require('./levels');
const printer = require('./print');
const { getCallInfo } = require('./utils');

class Cimico {
  constructor(label, isEnabled, config = {}) {
    this.label = label;
    this.levels = levels(label, isEnabled);
    this.config = config;
    this.readers = {
      callsite: getCallInfo(config.baseDir),
    };
    this.current = {};
  }

  cleanup() {
    this.current = {};
    return this;
  }

  setConfig(flag, value) {
    this.current = Object.assign(this.current, {
      [flag]: value,
    });
    return this;
  }

  pretty(value = 'all') {
    return this.setConfig('pretty', value);
  }

  p(value = 'all') {
    return this.setConfig('pretty', value);
  }

  colors(value = true) {
    return this.setConfig('colors', value);
  }

  c(value = true) {
    return this.setConfig('colors', value);
  }

  filename(value = true) {
    return this.setConfig('filename', value);
  }

  fn(value = true) {
    return this.setConfig('filename', value);
  }

  method(value = true) {
    return this.setConfig('method', value);
  }

  md(value = true) {
    return this.setConfig('method', value);
  }

  getLevel(level) {
    return this.levels[level];
  }

  print(level, args) {
    printer(this.levels[level], args, this.readers.callsite(callsites()[2]), Object.assign({
      label: this.label,
    }, this.config, this.current));
    this.cleanup();
    return this;
  }

  log(...args) {
    return this.print('log', args);
  }

  info(...args) {
    return this.print('info', args);
  }

  success(...args) {
    return this.print('success', args);
  }

  warn(...args) {
    return this.print('warn', args);
  }

  debug(...args) {
    return this.print('debug', args);
  }

  error(...args) {
    return this.print('error', args);
  }
}

module.exports = Cimico;
