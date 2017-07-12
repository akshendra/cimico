/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 19:19:40
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 22:17:28
 */

const chalk = require('chalk');
const figures = require('figures');
const R = require('ramda');

const levelMap = R.curry((parent, isEnabled, [name, mark, color, stream]) => {
  const enabled = isEnabled(`${parent}:${name}`);
  return {
    enabled,
    mark,
    color,
    stream,
  };
});

function levels(label, isEnabled, streams = { stdout: process.stdout, stderr: process.stderr }) {
  const { stdout, stderr } = streams;
  const mapper = levelMap(label, isEnabled);
  return {
    log: mapper(['log', figures.play, chalk.white, stdout]),
    info: mapper(['info', figures.info, chalk.blue, stdout]),
    success: mapper(['success', figures.tick, chalk.green, stdout]),
    debug: mapper(['debug', figures.checkboxOn, chalk.gray, stdout]),
    warn: mapper(['warn', figures.warning, chalk.yellow, stdout]),
    error: mapper(['error', figures.cross, chalk.red, stderr]),
  };
}

module.exports = levels;
