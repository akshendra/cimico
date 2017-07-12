/**
 * Tests for utils
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-12 18:30:29
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 20:18:22
 */

const expect = require('chai').expect;

const { namespaces, enabled } = require('../libs/utils');

describe('namespaces', function () {
  it('should be able to convert a simple string into array of namespaces', function () {
    const string = 'app:*,debug:log,controllers';
    expect(namespaces(string)).to.deep.equal(['app:.*?', 'debug:log', 'controllers']);
  });

  it('should be able to convert a little out of shape string into array of namepsaces', function () {
    const string = 'app:*:*, debug:log, controller:*:info, info,';
    expect(namespaces(string)).to.deep.equal(['app:.*?:.*?', 'debug:log', 'controller:.*?:info', 'info']);
  });
});

describe('enabled', function () {
  it('should give true when the label is present', function () {
    const string = 'app:*, -debug:log:*, debug:*:info';
    const isEnabled = enabled(string);

    expect(isEnabled('app:log')).to.be.true;
    expect(isEnabled('debug')).to.be.false;
    expect(isEnabled('app')).to.be.false;
    expect(isEnabled('debug:log:info')).to.be.false;
    expect(isEnabled('debug.log')).to.be.false;
    expect(isEnabled('debug:test:info')).to.be.true;
  });

  it('should give true for everything', function () {
    const isEnabled = enabled('*');

    expect(isEnabled('app:log')).to.be.true;
    expect(isEnabled('debug')).to.be.true;
    expect(isEnabled('app')).to.be.true;
    expect(isEnabled('debug:log:info')).to.be.true;
    expect(isEnabled('debug.log')).to.be.true;
    expect(isEnabled('debug:test:info')).to.be.true;
  });
});
