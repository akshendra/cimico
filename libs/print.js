/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 18:57:12
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-13 02:48:17
 */

const util = require('util');
const is = require('is_js');
const R = require('ramda');
const chalk = require('chalk');
const pj = require('prettyjson');
const figures = require('figures');
const PrettyError = require('pretty-error');

const { filterEmpty, isFormatString,
  extractFormatters, splitAtFormatters } = require('./utils');

const ps = figures.pointerSmall;
const pe = new PrettyError();
pe.skipNodeFiles();
pe.appendStyle({
  'pretty-error': {
    marginLeft: 0,
  },
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
    padding: '0 1', // Top/bottom left/right
  },
  'pretty-error > trace > item': {
    color: 'bright-red',
    margin: '0 3',
    bullet: `"<grey> - </grey>"`,
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

const divider = chalk.dim(` ${ps} `);

function indent(string, indentNum, notFirst = false) {
  const indentation = R.times(() => ' ', indentNum).join('');
  return string.split('\n').map((s, index) => {
    if (index === 0 && notFirst === true) {
      return s;
    }
    return `${indentation}${s}`;
  }).join('\n');
}

function expandError(err, config, labelPad, oneDone = false) {
  const {
    pretty,
    colors,
  } = config;

  if (pretty === 'all' || pretty.indexOf('errors') !== -1) {
    const str = indent(`${ps} ${pe.render(err, false, colors).replace(/\u001b\[0m\n\u001b\[0m$/, '')}`, labelPad, !oneDone);
    if (oneDone) {
      return `\n${str}`;
    }
    return indent(`${pe.render(err, false, colors).replace(/\u001b\[0m\n\u001b\[0m$/, '')}`, labelPad, !oneDone);
  }

  if (oneDone) {
    const str = indent(`${ps} ${err.stack}`, labelPad, !oneDone);
    return `\n${str}`;
  }
  return indent(err.stack, labelPad, !oneDone);
}

function expandObjArr(value, config, labelPad, oneDone = false) {
  const {
    pretty,
    colors,
  } = config;

  const count = value.count ? `<${value.count}>` : '';
  let name = `Object ${count}`;
  if (is.array(value)) {
    name = `Array ${count}`;
  }

  name = chalk.underline.dim(name);

  if (pretty === 'all' || pretty.indexOf('object') !== -1) {
    const string = pj.render(value, {
      noColor: !colors,
    }, oneDone ? 3 : labelPad + 1);
    if (oneDone) {
      const str = indent(`${ps} ${name}\n${string}`, labelPad, !oneDone);
      return `\n${str}`;
    }
    return `${name}\n${string}`;
  }

  const string = indent(util.inspect(value, false, 7, !colors), oneDone ? 3 : labelPad + 1, !oneDone);
  if (oneDone) {
    const str = indent(`${ps} ${name}\n${string}`, labelPad, !oneDone);
    return `\n${str}`;
  }
  return `${name}\n${string}`;
}

function applyFormat(string, fstring) {
  let formatter = chalk;
  fstring.split('').forEach(frmt => {
    switch (frmt) {
      case 'b':
        formatter = formatter.bold;
        break;
      case 'u':
        formatter = formatter.underline;
        break;
      case 'd':
        formatter = formatter.dim;
        break;
      default:
        break;
    }
  });
  return formatter(string);
}

function expandArgs(args, config, labelpad) {
  if (is.empty(args)) {
    return '';
  }
  let values = [];

  if (isFormatString(args[0])) {
    const formatString = args[0];
    const formatters = extractFormatters(formatString);
    const rest = args.slice(1);
    const end = [];

    let fnum = 1;
    let startString = formatString;
    formatters.forEach((formatter, index) => {
      const restArg = rest[index];
      if (formatter) {
        const f = formatter.substr(1);
        if (is.string(restArg) || is.number(restArg)) {
          startString = startString.replace(formatter, applyFormat(restArg, f));
        } else {
          startString = startString.replace(formatter, applyFormat(`_${fnum}_`, f));
          restArg.count = fnum;
          end.push(restArg);
          fnum += 1;
        }
      }
    });

    values = [startString].concat(end);
  } else {
    values = args;
  }

  let final = '';
  let firstLine = true;
  values.forEach((value, index) => {
    if (is.string(value) || is.number(value)) {
      if (firstLine) {
        final += `${value} `;
      } else {
        final += '\n';
        final += indent(`${ps} ${value}`, labelpad, false);
      }
    } else if (value instanceof Error) {
      final += expandError(value, config, labelpad, index > 0);
      firstLine = false;
    } else if (is.object(value) || is.array(value)) {
      final += expandObjArr(value, config, labelpad, index > 0);
      firstLine = false;
    }
  });

  return final.trim();
}

const colorIt = R.curry(function colorIt(enabled, color, string) {
  if (enabled === true) {
    return color(string);
  }
  return string;
});

const print = function print(level, args, cs, config) {
  const { enabled, mark, color, stream } = level;
  const { label, filename, colors } = config;

  if (enabled === false) {
    return;
  }

  const labelPad = is.empty(label) ? label.length + 2 : label.length + 3;

  const colored = colorIt(colors)(color);
  const labelstr = colored(label);
  const csStr = cs(filename);
  const body = colored(expandArgs(args, config, labelPad));
  const strings = filterEmpty([labelstr, csStr, body]);

  const final = `${mark} ${strings.join(divider)}`;
  stream.write(`${final.trim()}\n`);
};

module.exports = print;
