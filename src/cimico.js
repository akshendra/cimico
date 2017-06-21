/* Logger module
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 02:07:58
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-22 03:29:23
 */

const chalk = require('chalk');
const figures = require('figures');
const callsites = require('callsites');
const PrettyError = require('pretty-error');

const pe = new PrettyError();
// pe.withoutColors();
pe.skipNodeFiles();
pe.appendStyle({
  'pretty-error > trace': {
    display: 'block',
    marginTop: 0,
  },

  'pretty-error > header': {
    color: 'bright-red',
  },
  // this is a simple selector to the element that says 'Error'
  'pretty-error > header > title > kind': {
    // which we can hide:
    color: 'bright-red',
    background: 'none',
  },

  // the 'colon' after 'Error':
  'pretty-error > header > colon': {
    color: 'bright-red',
    // we hide that too:
    // display: 't',
  },

  // our error message
  'pretty-error > header > message': {
    color: 'bright-red',
    // let's change its color:

    // we can use black, red, green, yellow, blue, magenta, cyan, white,
    // grey, bright-red, bright-green, bright-yellow, bright-blue,
    // bright-magenta, bright-cyan, and bright-white

    // we can also change the background color:
    // background: 'cyan',

    // it understands paddings too!
    padding: '0 0', // top/bottom left/right
  },

  // each trace item ...
  'pretty-error > trace > item': {
    color: 'bright-red',
    // ... can have a margin ...
    marginTop: 0,
    margin: '0 2',

    // ... and a bullet character!
    bullet: '"<grey>-</grey>"',

    // Notes on bullets:
    //
    // The string inside the quotation mark gets used as the character
    // to show for the bullet point.
    //
    // You can set its color/background color using tags.
    //
    // This example sets the background color to white, and the text color
    // to cyan, the character will be a hyphen with a space character
    // on each side:
    // example: '"<bg-white><cyan> - </cyan></bg-white>"'
    //
    // Note that we should use a margin of 3, since the bullet will be
    // 3 characters long.
  },

  'pretty-error > trace > item > header > pointer > file': {
    color: 'bright-cyan',
  },

  'pretty-error > trace > item > header > pointer > colon': {
    color: 'cyan',
  },

  'pretty-error > trace > item > header > pointer > line': {
    color: 'bright-cyan',
  },

  'pretty-error > trace > item > header > what': {
    color: 'bright-white',
  },

  'pretty-error > trace > item > footer > addr': {
    color: 'grey',
    // display: 'none',
  },
});

const utils = require('./utils');

class Cimico {
  constructor(map, label, baseDir = null) {
    this.label = label;
    this.enabled = {
      log: utils.checkEnabled(map, `${label}:log`),
      success: utils.checkEnabled(map, `${label}:success`),
      error: utils.checkEnabled(map, `${label}:error`),
      debug: utils.checkEnabled(map, `${label}:debug`),
      pretty: utils.checkEnabled(map, `${label}:pretty`),
      bordered: utils.checkEnabled(map, `${label}:pretty`),
    };
    this.baseDir = baseDir;
  }

  internal(fragments, stream, cs, formater, figure) {
    const header = `${figure} ${utils.getCallInfo(cs, this.baseDir)}\n`;
    stream.write(formater(header));
    fragments.forEach((frag) => {
      if (typeof frag === 'string') {
        stream.write(chalk.white(`  ${frag}\n`));
        return;
      }
      if (frag instanceof Error) {
        stream.write(pe.render(frag));
      }
    });
  }

  log(...args) {
    const cs = callsites()[1];
    this.internal(args, process.stdout, cs, chalk.blue, figures.tick);
  }

  error(...args) {
    const cs = callsites()[1];
    this.internal(args, process.stderr, cs, chalk.red.bold, figures.cross);
  }
}

module.exports = Cimico;
