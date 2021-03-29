'use strict';

/**
 * Module dependencies.
 */

require('should');

var nock = require('nock');
var sinon = require('sinon');

var Consul = require('../lib');

/**
 * Setup tests
 */

function setup(scope) {
  if (scope._setup) return;
  scope._setup = true;

  beforeEach.call(scope, function() {
    var self = this;

    self.sinon = sinon.createSandbox();

    nock.disableNetConnect();

    Object.defineProperty(self, 'consul', {
      configurable: true,
      enumerable: true,
      get: function() {
        return new Consul();
      },
    });

    Object.defineProperty(self, 'nock', {
      configurable: true,
      enumerable: true,
      get: function() {
        return nock('http://127.0.0.1:8500');
      },
    });
  });

  afterEach.call(scope, function() {
    this.sinon.restore();

    nock.cleanAll();
  });
}

/**
 * Module exports.
 */

exports.consul = Consul;
exports.setup = setup;
