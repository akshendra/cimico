/* Tests for the parser module
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-22 01:31:04
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-22 17:13:12
 */

const callsites = require('callsites');
const expect = require('chai').expect;

const utils = require('../src/utils');

function bar() {
  return callsites();
}

function foo() {
  return bar();
}

const eg = {
  bar() {
    return callsites();
  },

  foo() {
    return this.bar();
  },
};

describe('parserEnv', () => {
  it('should be able to create a map', () => {
    const string = 'app:parser:*,debug:*,debug:parser:info';
    const map = utils.parseEnv(string);
    expect(map).to.deep.equal({
      app: {
        parser: {
          '*': true,
        },
      },
      debug: {
        '*': true,
        parser: {
          info: true,
        },
      },
    });
  });
});

describe('checkEnabled', () => {
  it('should give true', () => {
    const string = 'app:parser:*,debug:*,debug:parser:info';
    const map = utils.parseEnv(string);
    const ce = utils.checkEnabled.bind(utils);
    expect(ce(map, 'app:parser:info')).to.be.true;
    expect(ce(map, 'app:parser:error')).to.be.true;
    expect(ce(map, 'app:parser')).to.be.false;
    expect(ce(map, 'debug:log:info')).to.be.true;
    expect(ce(map, 'debug:parser:info')).to.be.true;
    expect(ce(map, 'debug:parser:log')).to.be.false;
  });
});

describe('getCallInfo', () => {
  it('should get correct info for normal funtion calls', () => {
    const cs = foo()[0];
    const string = utils.getCallInfo(cs, __dirname);
    expect(string).to.equal('utils.spec.js[bar]:15');
  });

  it('should get correct info for methods', () => {
    const cs = eg.foo()[0];
    const string = utils.getCallInfo(cs, __dirname);
    expect(string).to.equal('utils.spec.js[bar]:24');
  });
});

describe('inspectFormat', () => {
  it('should be able to find key', () => {
    const string = '%bu(name)';
    const data = utils.inspectFormat(string);
    expect(data).to.deep.equal({
      key: 'name',
      formatters: ['b', 'u'],
    });
  });

  it('should not find key when there is not key', () => {
    const string = '%bu';
    const data = utils.inspectFormat(string);
    expect(data).to.deep.equal({
      key: null,
      formatters: ['b', 'u'],
    });
  });

  it('should not find the formaters where there are no formatters', () => {
    const string = '%(name)';
    const data = utils.inspectFormat(string);
    expect(data).to.deep.equal({
      key: 'name',
      formatters: [],
    });
  });
});
