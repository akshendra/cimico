/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 18:57:12
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-07 00:13:55
 */

const is = require('is_js');
const util = require('util');
const chalk = require('chalk');
const pj = require('prettyjson');
const figures = require('figures');
const callsites = require('callsites');
const PrettyError = require('pretty-error');

const utils = require('./utils');

const pe = new PrettyError();

pe.skipNodeFiles();
pe.appendStyle({
  'pretty-error': {
    marginLeft: 3,
  },
  'pretty-error > trace': {
    display: 'block',
    marginTop: 0
  },
  'pretty-error > header': {
    color: 'bright-red'
  },
  'pretty-error > header > title > kind': {
    color: 'bright-red',
    background: 'none'
  },
  'pretty-error > header > colon': {
    color: 'bright-red'
  },
  'pretty-error > header > message': {
    color: 'bright-red',
    padding: '0 1' // top/bottom left/right
  },
  'pretty-error > trace > item': {
    color: 'bright-red',
    margin: '0 3',
    bullet: `"<grey> ${figures.pointerSmall} </grey>"`
  },
  'pretty-error > trace > item > header > pointer > file': {
    color: 'bright-cyan'
  },
  'pretty-error > trace > item > header > pointer > colon': {
    color: 'cyan'
  },
  'pretty-error > trace > item > header > pointer > line': {
    color: 'bright-cyan'
  },
  'pretty-error > trace > item > header > what': {
    color: 'bright-white'
  },
  'pretty-error > trace > item > footer > addr': {
    color: 'grey'
  }
});

// module.exports = {
//   combineStrings(args) {
//     const strings = [];
//     let i = 0;
//     for (i = 0; i < args.length; i += 1) {
//       const arg = args[i];
//       if (is.string(arg) || is.boolean(arg) || is.number(arg)) {
//         strings.push(arg);
//       } else {
//         break;
//       }
//     }
//     return {
//       rest: args.slice(i),
//       combined: strings.join(' ')
//     };
//   },

//   // eslint-disable-next-line
//   formatter(args) {
//     const prints = [];

//     let formatString = args.shift();

//     const re = /%([dbu]*(\(.*?\))?)/g;
//     const matches = formatString.match(re);
//     matches.forEach((match, index) => {
//       const compiled = utils.inspectFormat(match);
//       let formater = chalk.white;
//       compiled.formatters.forEach((f) => {
//         switch (f) {
//           case 'd':
//             formater = formater.dim;
//             break;
//           case 'b':
//             formater = formater.bold;
//             break;
//           case 'u':
//             formater = formater.underline;
//             break;
//           default:
//             throw new Error(`Unsupported formatter ${f}`);
//         }
//       });

//       let replaceString = '';
//       const value = args[index];
//       if (is.string(value) || is.boolean(value) || is.number(value)) {
//         replaceString = formater(value);
//       } else {
//         replaceString = chalk.dim(`__${index + 1}__`);
//         prints.push(value);
//       }
//       if (compiled.key) {
//         replaceString = `${compiled.key}=${replaceString}`;
//       }
//       formatString = formatString.replace(match, replaceString);
//     });

//     return {
//       combined: formatString,
//       rest: prints
//     };
//   },

//   getHeader(figure, cs) {
//     let string = `${chalk.underline(this.label)} ${figure}`;
//     if (this.current.timestamp === true) {
//       string += ` ${chalk.dim.underline(utils.getTimeStamp())} :`;
//     }
//     if (this.current.filename === true) {
//       string += ` ${chalk.dim.underline(utils.getCallInfo(cs, this.current.baseDir))} :`;
//     }

//     return `${string}`;
//   },

//   print(header, combined, rest, stream, formater) {
//     if (this.current.color === true) {
//       stream.write(formater(`${header} ${combined}\n`));
//     } else {
//       stream.write(`${header} ${combined}\n`);
//     }

//     rest.forEach((frag, index) => {
//       if (is.string(frag) || is.boolean(frag) || is.number(frag)) {
//         stream.write(
//           chalk.white(` ${chalk.dim(figures.squareSmall)}  ${frag}\n`)
//         );
//         this.cleanup();
//         return;
//       }

//       let name = '';
//       if (this.current.format === true) {
//         name = chalk.dim(`__${index + 1}__`);
//       } else {
//         name = chalk.dim('__inspect__');
//       }
//       const inspectString = ` ${chalk.dim(figures.squareSmall)} ${name}\n`;

//       if (is.error(frag)) {
//         if (this.current.pretty === true) {
//           stream.write(
//             ` ${figures.squareSmall}${pe.render(frag, false, this.current.color)}`
//           );
//         } else {
//           stream.write(` ${figures.squareSmall}  ${frag.stack}\n`);
//         }
//         this.cleanup();
//         return;
//       }

//       if (this.current.pretty === true) {
//         stream.write(inspectString);
//         stream.write(
//           `${pj.render(frag, { noColor: !this.current.color }, 2)}\n`
//         );
//       } else {
//         stream.write(inspectString);
//         const formatted = util
//           .inspect(frag, false, 10, this.current.color)
//           .split('\n')
//           .map(s => `  ${s}`)
//           .join('\n');
//         stream.write(`${formatted}\n`);
//       }
//     });
//   },

//   internal(fragments, stream, formater, figure) {
//     this.current = Object.assign({}, this.config, this.current);
//     const {
//       format
//     } = this.current;
//     const cs = callsites()[2];

//     const header = this.getHeader(figure, cs);

//     if (format === false) {
//       const {
//         combined,
//         rest
//       } = this.combineStrings(fragments);
//       this.print(header, combined, rest, stream, formater, figure);
//     } else {
//       const {
//         combined,
//         rest
//       } = this.formatter(fragments);
//       this.print(header, combined, rest, stream, formater, figure);
//     }
//   }
// };

function divider() {
  return chalk.dim(` ${figures.pointerSmall} `);
}

function indent(string, indentation = '   ') {
  return string.split('\n').map(s => `${indentation}${s}`).join('\n');
}

function expandError(err, config, oneDone) {
  const {
    pretty,
    colors,
  } = config;

  if (pretty === 'all' || pretty.indexOf('errors') !== -1) {
    if (oneDone) {
      return `\n${pe.render(err, false, colors).replace(/\u001b\[0m\n\u001b\[0m$/, '')}`;
    }
    return `${pe.render(err, false, colors).replace(/\u001b\[0m\n\u001b\[0m$/, '')}`;
  }

  if (oneDone) {
    return `\n${indent(err.stack)}`;
  }
  return `\n${indent(err.stack)}`;
}

function expandArgs(args, config) {
  let string = '';
  let first = true;
  let oneDone = false;
  args.forEach((arg) => {
    if (is.string(arg) || is.number(arg)) {
      if (first) {
        string += `${arg} `;
      } else {
        string += `\n  ${divider()} ${arg}`;
      }
      oneDone = true;
    } else if (arg instanceof Error) {
      string += expandError(arg, config, oneDone);
      first = false;
      oneDone = true;
    } else if (is.object(arg) || is.array(arg)) {
      string += JSON.stringify(arg);
      first = false;
      oneDone = true;
    }
  });

  return string.trim();
}

function getHeader(cs, config) {
  const {
    timestamp,
    filename,
    baseDir,
  } = config;

  let string = '';

  if (timestamp) {
    string += `${chalk.dim.underline(utils.getTimeStamp())}${divider()}`;
  }

  if (filename) {
    string += `${chalk.dim.underline(utils.getCallInfo(cs, baseDir))}${divider()}`;
  }

  return string;
}

function colorIt(string, color, config) {
  const {
    colors
  } = config;
  if (colors === true) {
    return color(string);
  }
  return string;
}

function print(level, args, cs, config) {
  const {
    name,
    enabled,
    mark,
    color,
    stream,
  } = level;

  const {
    label
  } = config;

  if (enabled === false) {
    return;
  }

  const front = ` ${mark} ${label}`;
  const header = getHeader(cs, config);
  const body = expandArgs(args, config);

  const final = `${colorIt(front, color, config)}${divider()}${header}${colorIt(body, color, config)}`;
  stream.write(`${final.trim()}\n`);
}

module.exports = print;