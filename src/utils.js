/*
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 01:24:49
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-22 22:30:56
 */

const path = require('path');

/**
 * Recusively add properties to the map
 *
 * @param {object} map
 * @param {string[]} parts
 */
function parseEnvR(map, parts) {
  const part = parts.shift();
  if (parts.length <= 0) {
    Object.assign(map, {
      [part]: true,
    });
  } else {
    Object.assign(map, {
      [part]: map[part] || {},
    });
    parseEnvR(map[part], parts);
  }
}

function lookInMap(map, parts) {
  if (!map) {
    return false;
  }

  if (parts.length <= 0) {
    return false;
  }

  const part = parts.shift();

  const value = map[part] || map['*'];
  if (value === true) {
    return value;
  }

  return lookInMap(value, parts);
}

module.exports = {
  /**
   * Prase the env string and create a lookup map
   *
   * @param {string} string
   * @returns {object}
   */
  parseEnv(string) {
    const map = {};
    if (!string) {
      return map;
    }
    const fragments = string.split(',');
    fragments.forEach((frag) => {
      parseEnvR(map, frag.split(':'));
    });
    return map;
  },

  /**
   * Check if a log label is enabled
   *
   * @param {Object} map
   * @param {string} label
   *
   * @returns {bool}
   */
  checkEnabled(map, label) {
    return lookInMap(map, label.split(':'));
  },

  /**
   * Return a string representation of the call info
   *
   * @param {Object} cs
   * @param {string} base - the base directory to print filename relative to
   *
   * @returns {string}
   */
  getCallInfo(cs, base) {
    let filename = cs.getFileName() || cs.getMethodName();
    if (base) {
      filename = path.relative(base, filename);
    }
    return `${filename}[${cs.getFunctionName()}]:${cs.getLineNumber()}`;
  },

  /**
   * Reutrn ISO string of current time
   *
   * @returns {string}
   */
  getTimeStamp() {
    return new Date().toISOString();
  },

  /**
   * Inspect format string
   *
   * @return {object}
   */
  inspectFormat(string) {
    const re = /%([budsi]*)(\((.*)\))?/;
    const match = string.match(re);

    return {
      formatters: match[1] ? match[1].split('') : [],
      key: match[3] ? match[3] : null,
    };
  },
};
