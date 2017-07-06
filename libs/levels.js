/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 19:19:40
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-06 23:09:33
 */

const chalk = require('chalk');
const figures = require('figures');

const utils = require('./utils');

function levelMap(name, parent, map, mark, color, stream = process.stdout) {
  const enabled = utils.checkEnabled(map, `${parent}:${name}`);
  return {
    name,
    enabled,
    mark,
    color,
    stream,
  };
}

module.exports = {
  log: (parent, map) => levelMap('log', parent, map, figures.play, chalk.white),
  info: (parent, map) => levelMap('info', parent, map, figures.info, chalk.blue),
  success: (parent, map) => levelMap('success', parent, map, figures.tick, chalk.green),
  debug: (parent, map) => levelMap('debug', parent, map, figures.checkboxOn, chalk.dim.white),
  warn: (parent, map) => levelMap('warn', parent, map, figures.warning, chalk.yellow),
  error: (parent, map) => levelMap('warn', parent, map, figures.cross, chalk.red, process.stderr),
};