/**
 * Tests levels generator
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-07-12 22:19:27
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-07-12 22:25:19
 */

const expect = require('chai').expect;

const levels = require('../libs/levels');
const { enabled } = require('../libs/utils');

describe('levels', function () {
  it('should have all enabled', function () {
    const nss = 'app:*';
    const isEnabled = enabled(nss);
    const lvls = levels('app', isEnabled);
    expect(lvls.log.enabled).to.be.true;
    expect(lvls.info.enabled).to.be.true;
    expect(lvls.success.enabled).to.be.true;
    expect(lvls.error.enabled).to.be.true;
    expect(lvls.warn.enabled).to.be.true;
    expect(lvls.debug.enabled).to.be.true;
  });

  it('should have all disabled', function () {
    const nss = 'debug:*';
    const isEnabled = enabled(nss);
    const lvls = levels('app', isEnabled);
    expect(lvls.log.enabled).to.be.false;
    expect(lvls.info.enabled).to.be.false;
    expect(lvls.success.enabled).to.be.false;
    expect(lvls.error.enabled).to.be.false;
    expect(lvls.warn.enabled).to.be.false;
    expect(lvls.debug.enabled).to.be.false;
  });

  it('should have all disabled because of negation', function () {
    const nss = '-app:*';
    const isEnabled = enabled(nss);
    const lvls = levels('app', isEnabled);
    expect(lvls.log.enabled).to.be.false;
    expect(lvls.info.enabled).to.be.false;
    expect(lvls.success.enabled).to.be.false;
    expect(lvls.error.enabled).to.be.false;
    expect(lvls.warn.enabled).to.be.false;
    expect(lvls.debug.enabled).to.be.false;
  });

  it('should have only a few enabled', function () {
    const nss = 'app:info, app:success';
    const isEnabled = enabled(nss);
    const lvls = levels('app', isEnabled);
    expect(lvls.log.enabled).to.be.false;
    expect(lvls.info.enabled).to.be.true;
    expect(lvls.success.enabled).to.be.true;
    expect(lvls.error.enabled).to.be.false;
    expect(lvls.warn.enabled).to.be.false;
    expect(lvls.debug.enabled).to.be.false;
  });
});
