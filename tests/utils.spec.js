/**
 * Tests for utils
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-12 18:30:29
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 21:58:39
 */

const expect = require('chai').expect;

const { namespaces, enabled, isFormatString,
  splitAtFormatters, extractFormatters } = require('../libs/utils');

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

  it('should give false for everything', function () {
    const isEnabled = enabled('');

    expect(isEnabled('app:log')).to.be.false;
    expect(isEnabled('debug')).to.be.false;
    expect(isEnabled('app')).to.be.false;
    expect(isEnabled('debug:log:info')).to.be.false;
    expect(isEnabled('debug.log')).to.be.false;
    expect(isEnabled('debug:test:info')).to.be.false;
  });
});

describe('Format string', function () {
  it('isFromatString should give true for a string using formatters', function () {
    expect(isFormatString('This is format %b')).to.be.true;
    expect(isFormatString('This is format %bu')).to.be.true;
    expect(isFormatString('This is %u format %b')).to.be.true;
    expect(isFormatString('This is format %ub')).to.be.true;
  });

  it('splitAtFormatters should split the string at formatters', function () {
    const string = 'This is bold %b and underline %u, and this is both %bu';
    expect(splitAtFormatters(string)).to.deep.equal([
      'This is bold ',
      ' and underline ',
      ', and this is both ',
      '',
    ]);
  });

  it('extractFormatters should extrct at format switches', function () {
    const string = 'This is bold %b and underline %u, and this is both %bu';
    expect(extractFormatters(string)).to.deep.equal([
      '%b',
      '%u',
      '%bu',
    ]);
  });
});
