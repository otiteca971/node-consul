const errors = require('./errors');
const utils = require('./utils');

/**
 * Query manipulation
 */
class Query {
  constructor(consul) {
    this.consul = consul;
  }

  /**
   * Lists all queries
   */
  list(opts) {
    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'query.list',
      path: '/query',
    };

    utils.options(req, opts);

    return this.consul._get(req, utils.body, callback);
  }

  /**
   * Create a new query
   */
  create(opts) {
    if (typeof opts === 'string') {
      opts = { service: { service: opts } };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'query.create',
      path: '/query',
      query: {},
      type: 'json',
    };

    try {
      this._params(req, opts);
      if (!req.body.Service || !req.body.Service.Service) {
        throw errors.Validation('service required');
      }
    } catch (err) {
      return this.consul._err(err, req);
    }

    utils.options(req, opts, { near: true });

    return this.consul._post(req, utils.body, callback);
  };

  /**
   * Gets a given query
   */
  get(opts, callback) {
    if (typeof opts === 'string') {
      opts = { query: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'query.get',
      path: '/query/{query}',
      params: { query: opts.query },
      query: {},
    };

    if (!opts.query) {
      return callback(this.consul._err(errors.Validation('query required'), req));
    }

    utils.options(req, opts);

    this.consul._get(req, utils.bodyItem, callback);
  };

  /**
   * Update existing query
   */
  update(opts, callback) {
    if (!callback) {
      callback = opts;
      opts = {};
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'query.update',
      path: '/query/{query}',
      params: { query: opts.query },
      query: {},
      type: 'json',
    };

    try {
      if (!opts.query) throw errors.Validation('query required');
      this._params(req, opts);
      if (!req.body.Service || !req.body.Service.Service) {
        throw errors.Validation('service required');
      }
    } catch (err) {
      return callback(this.consul._err(err, req));
    }

    utils.options(req, opts, { near: true });

    this.consul._put(req, utils.empty, callback);
  }

  /**
   * Destroys a given query
   */
  destroy(opts) {
    if (typeof opts === 'string') {
      opts = { query: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'query.destroy',
      path: '/query/{query}',
      params: { query: opts.query },
      query: {},
    };

    if (!opts.query) {
      return callback(this.consul._err(errors.Validation('query required'), req));
    }

    utils.options(req, opts);

    this.consul._delete(req, utils.empty, callback);
  }
}

/**
 * Executes a given query
 */

Query.prototype.execute = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { query: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  const req = {
    name: 'query.execute',
    path: '/query/{query}/execute',
    params: { query: opts.query },
    query: {},
  };

  if (!opts.query) {
    return callback(this.consul._err(errors.Validation('query required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Explain a given query
 */

Query.prototype.explain = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { query: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  const req = {
    name: 'query.explain',
    path: '/query/{query}/explain',
    params: { query: opts.query },
    query: {},
  };

  if (!opts.query) {
    return callback(this.consul._err(errors.Validation('query required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.bodyItem, callback);
};

/**
 * Generate body for query create and update
 */

Query.prototype._params = function(req, opts) {
  const body = req.body || {};

  if (opts.name) body.Name = opts.name;
  if (opts.session) body.Session = opts.session;
  if (opts.token) {
    body.Token = opts.token;
    delete opts.token;
  }
  if (opts.near) body.Near = opts.near;
  if (opts.template) {
    const template = utils.normalizeKeys(opts.template);
    if (template.type || template.regexp) {
      body.Template = {};
      if (template.type) body.Template.Type = template.type;
      if (template.regexp) body.Template.Regexp = template.regexp;
    }
  }
  if (opts.service) {
    const service = utils.normalizeKeys(opts.service);
    body.Service = {};
    if (service.service) body.Service.Service = service.service;
    if (service.failover) {
      const failover = utils.normalizeKeys(service.failover);
      if (typeof failover.nearestn === 'number' || failover.datacenters) {
        body.Service.Failover = {};
        if (typeof failover.nearestn === 'number') {
          body.Service.Failover.NearestN = failover.nearestn;
        }
        if (failover.datacenters) {
          body.Service.Failover.Datacenters = failover.datacenters;
        }
      }
    }
    if (typeof service.onlypassing === 'boolean') {
      body.Service.OnlyPassing = service.onlypassing;
    }
    if (service.tags) body.Service.Tags = service.tags;
  }
  if (opts.dns) {
    const dns = utils.normalizeKeys(opts.dns);
    if (dns.ttl) body.DNS = { TTL: dns.ttl };
  }

  req.body = body;
};

/**
 * Module exports.
 */

exports.Query = Query;
