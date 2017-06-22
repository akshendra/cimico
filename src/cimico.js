/* Logger module
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 02:07:58
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-22 22:21:39
 */

const is = require('is_js');
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
    this.config = config;
    this.current = {};
  }

  cleanup() {
    this.current = {};
  }

  setFlag(flag) {
    Object.assign(this.current, {
      [flag]: true,
    });
  }

  // eslint-disable-next-line
  combineStrings(args) {
    const strings = [];
    let i = 0;
    for (i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if (is.string(arg) || is.boolean(arg) || is.number(arg)) {
        strings.push(arg);
      } else {
        break;
      }
    }
    return {
      rest: args.slice(i),
      combined: strings.join(' '),
    };
  }

  // eslint-disable-next-line
  formatter(args) {
    const prints = [];

    let formatString = args.shift();

    const re = /%([bud]*(\(.*?\))?)/g;
    const matches = formatString.match(re);
    matches.forEach((match, index) => {
      const compiled = utils.inspectFormat(match);
      let formater = chalk.white;
      compiled.formatters.forEach((f) => {
        switch (f) {
          case 'd':
            formater = formater.dim;
            break;
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

      let replaceString = '';
      const value = args[index];
      if (is.string(value) || is.boolean(value) || is.number(value)) {
        replaceString = formater(value);
      } else {
        replaceString = chalk.dim(`__${index + 1}__`);
        prints.push(value);
      }
      if (compiled.key) {
        replaceString = `${compiled.key}=${replaceString}`;
      }
      formatString = formatString.replace(match, replaceString);
    });

    return {
      combined: formatString,
      rest: prints,
    };
  }

  getHeader(figure, cs) {
    let string = `${chalk.underline(this.label)} ${figure}`;
    if (this.current.timestamp === true) {
      string += ` ${chalk.dim.underline(utils.getTimeStamp())}`;
    }
    if (this.current.filename === true) {
      string += ` ${chalk.dim.underline(utils.getCallInfo(cs, this.current.baseDir))}`;
    }

    return `${string} :`;
  }

  print(header, combined, rest, stream, formater) {
    if (this.current.color === true) {
      stream.write(formater(`${header} ${combined}\n`));
    } else {
      stream.write(`${header} ${combined}\n`);
    }

    rest.forEach((frag, index) => {
      if (is.string(frag) || is.boolean(frag) || is.number(frag)) {
        stream.write(
          chalk.white(` ${chalk.dim(figures.squareSmall)}  ${frag}\n`),
        );
        this.cleanup();
        return;
      }

      let name = '';
      if (this.current.format === true) {
        name = chalk.dim(`__${index + 1}__`);
      } else {
        name = chalk.dim('__inspect__');
      }
      const inspectString = ` ${chalk.dim(figures.squareSmall)} ${name}\n`;

      if (is.error(frag)) {
        if (this.current.pretty === true) {
          stream.write(
            ` ${figures.squareSmall}${pe.render(frag, false, this.current.color)}`,
          );
        } else {
          stream.write(` ${figures.squareSmall}  ${frag.stack}\n`);
        }
        this.cleanup();
        return;
      }

      if (this.current.pretty === true) {
        stream.write(inspectString);
        stream.write(
          `${pj.render(frag, { noColor: !this.current.color }, 2)}\n`,
        );
      } else {
        stream.write(inspectString);
        const formatted = util
          .inspect(frag, false, 2, this.current.color)
          .split('\n')
          .map(s => `  ${s}`)
          .join('\n');
        stream.write(`${formatted}\n`);
      }
    });
  }

  internal(fragments, stream, formater, figure) {
    this.current = Object.assign({}, this.config, this.current);
    const { format } = this.current;
    const cs = callsites()[2];

    const header = this.getHeader(figure, cs);

    if (format === false) {
      const { combined, rest } = this.combineStrings(fragments);
      this.print(header, combined, rest, stream, formater, figure);
    } else {
      const { combined, rest } = this.formatter(fragments);
      this.print(header, combined, rest, stream, formater, figure);
    }
    this.cleanup();
  }

  log(...args) {
    if (this.enabled.log) {
      this.internal(args, process.stdout, chalk.grey, figures.pointerSmall);
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
}

module.exports = Cimico;
