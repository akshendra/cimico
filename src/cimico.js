/* Logger module
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 02:07:58
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-22 17:16:28
 */

const util = require('util');
const chalk = require('chalk');
const figures = require('figures');
const callsites = require('callsites');
const PrettyError = require('pretty-error');
const pj = require('prettyjson');

const pe = new PrettyError();

pe.skipNodeFiles();
pe.appendStyle({
  'pretty-error > trace': {
    display: 'block',
    marginTop: 0,
  },
  'pretty-error > header': {
    color: 'bright-red',
  },
  'pretty-error > header > title > kind': {
    color: 'bright-red',
    background: 'none',
  },
  'pretty-error > header > colon': {
    color: 'bright-red',
  },
  'pretty-error > header > message': {
    color: 'bright-red',
    padding: '0 0', // top/bottom left/right
  },
  'pretty-error > trace > item': {
    color: 'bright-red',
    marginTop: 0,
    margin: '0 2',
    bullet: '"<grey>-</grey>"',
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
  },
});

const utils = require('./utils');

class Cimico {
  constructor(map, label, config = {}) {
    this.label = label;
    this.enabled = {
      log: utils.checkEnabled(map, `${label}:log`),
      success: utils.checkEnabled(map, `${label}:success`),
      error: utils.checkEnabled(map, `${label}:error`),
      debug: utils.checkEnabled(map, `${label}:debug`),
    };
    this.config = Object.assign(
      {
        baseDir: null,
        prettyJSON: true,
        prettyError: true,
      },
      config,
    );
  }

  internal(fragments, stream, formater, figure) {
    const { baseDir, prettyJSON, prettyError } = this.config;
    const cs = callsites()[2];

    let header = `${chalk.underline(this.label)} ${figure} ${utils.getCallInfo(cs, baseDir)}`;
    if (
      fragments.length === 1 &&
      (typeof fragments[0] === 'string' || typeof fragments[0] === 'number')
    ) {
      header += ` :: ${chalk.dim(fragments[0])}\n`;
      stream.write(formater(header));
      return;
    }
    header += '\n';
    stream.write(formater(header));

    const inspectString = ` ${figures.squareSmall} ${chalk.dim('______inspect______')}\n`;

    fragments.forEach((frag) => {
      if (
        typeof frag === 'string' ||
        typeof frag === 'number' ||
        typeof frag === 'boolean'
      ) {
        stream.write(chalk.white(` ${figures.squareSmall}  ${frag}\n`));
        return;
      }

      if (frag instanceof Error) {
        if (prettyError === true) {
          stream.write(` ${figures.squareSmall}${pe.render(frag)}`);
        } else {
          stream.write(` ${figures.squareSmall}  ${frag.stack}\n`);
        }
        return;
      }

      if (typeof frag === 'object' || Array.isArray(frag)) {
        if (prettyJSON === true) {
          stream.write(inspectString);
          stream.write(`${pj.render(frag, {}, 2)}\n`);
        } else {
          stream.write(inspectString);
          const formatted = util
            .inspect(frag, false, 3, true)
            .split('\n')
            .map(s => `  ${s}`)
            .join('\n');
          stream.write(`${formatted}\n`);
        }
      }
    });
  }

  log(...args) {
    if (this.enabled.log) {
      this.internal(args, process.stdout, chalk.blue, figures.pointerSmall);
    }
  }

  success(...args) {
    if (this.enabled.success) {
      this.internal(args, process.stdout, chalk.green, figures.tick);
    }
  }

  error(...args) {
    if (this.enabled.error) {
      this.internal(args, process.stderr, chalk.red.bold, figures.cross);
    }
  }

  debug(...args) {
    if (this.enabled.debug) {
      this.internal(args, process.stderr, chalk.white, figures.bullet);
    }
  }

  // eslint-disable-next-line
  format(...args) {
    let formatString = args.shift();
    const re = /%([bu]*(\(.*?\))?)/g;
    const matches = formatString.match(re);
    matches.forEach((match, index) => {
      const compiled = utils.inspectFormat(match);
      let formater = chalk;
      compiled.formatters.forEach((f) => {
        switch (f) {
          case 'b':
            formater = formater.bold;
            break;
          case 'u':
            formater = formater.underline;
            break;
          default:
            throw new Error(`Unsupported formatter ${f}`);
        }
      });

      let replaceString = formater(args[index]);
      if (compiled.key) {
        replaceString = `${compiled.key}=${replaceString}`;
      }
      formatString = formatString.replace(match, replaceString);
    });
    process.stdout.write(`${formatString}\n`);
  }
}

module.exports = Cimico;
