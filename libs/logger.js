/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-06 17:57:34
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-06 18:11:00
 */

class Logger {
  /**
   * Creates an instance of Logger
   *
   * @param {Immutable Map} config
   * @memberof Logger
   */
  constructor(config) {
    this.config = config;
  }

  map(fx) {
    return Logger.of(fx(this.config));
  }
}

Logger.of = (label, config) => new Logger(label, config);

module.exports = Logger;
