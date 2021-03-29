const errors = require('./errors');
const utils = require('./utils');

/**
 * ACL manipulation
 */
class Acl {
  constructor(consul) {
    this.consul = consul;
  }

  /**
   * Creates one-time management token if not configured
   */
  bootstrap(opts) {
    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.bootstrap',
      path: '/acl/bootstrap',
      type: 'json',
    };

    utils.options(req, opts);

    return this.consul._put(req, utils.body);
  }

  /**
   * Creates a new token with policy
   */
  create(opts) {
    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.create',
      path: '/acl/create',
      query: {},
      type: 'json',
      body: {},
    };

    if (opts.name) req.body.Name = opts.name;
    if (opts.type) req.body.Type = opts.type;
    if (opts.rules) req.body.Rules = opts.rules;

    utils.options(req, opts);

    return this.consul._put(req, utils.body);
  }

  /**
   * Update the policy of a token
   */
  update(opts) {
    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.update',
      path: '/acl/update',
      query: {},
      type: 'json',
      body: {},
    };

    if (!opts.id) {
      throw this.consul._err(errors.Validation('id required'), req);
    }

    req.body.ID = opts.id;

    if (opts.name) req.body.Name = opts.name;
    if (opts.type) req.body.Type = opts.type;
    if (opts.rules) req.body.Rules = opts.rules;

    utils.options(req, opts);

    return this.consul._put(req, utils.empty);
  }

  /**
   * Destroys a given token
   */
  destroy(opts) {
    if (typeof opts === 'string') {
      opts = { id: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.destroy',
      path: '/acl/destroy/{id}',
      params: { id: opts.id },
      query: {},
    };

    if (!opts.id) {
      throw this.consul._err(errors.Validation('id required'), req);
    }

    utils.options(req, opts);

    return this.consul._put(req, utils.empty);
  }

  /**
   * Queries the policy of a given token
   */
  info(opts) {
    if (typeof opts === 'string') {
      opts = { id: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.info',
      path: '/acl/info/{id}',
      params: { id: opts.id },
      query: {},
    };

    if (!opts.id) {
      throw this.consul._err(errors.Validation('id required'), req);
    }

    utils.options(req, opts);

    return this.consul._get(req, utils.bodyItem);
  }

  get(opts) {
    return this.info(opts);
  }

  /**
   * Creates a new token by cloning an existing token
   */
  clone(opts) {
    if (typeof opts === 'string') {
      opts = { id: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.clone',
      path: '/acl/clone/{id}',
      params: { id: opts.id },
      query: {},
    };

    if (!opts.id) {
      throw this.consul._err(errors.Validation('id required'), req);
    }

    utils.options(req, opts);

    return this.consul._put(req, utils.body);
  }

  /**
   * Lists all the active tokens
   */
  list(opts) {
    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.list',
      path: '/acl/list',
      query: {},
    };

    utils.options(req, opts);

    return this.consul._get(req, utils.body);
  }

  /**
   * Check ACL replication
   */
  replication(opts) {
    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'acl.replication',
      path: '/acl/replication',
      query: {},
    };

    utils.options(req, opts);

    return this.consul._get(req, utils.body);
  }
}

exports.Acl = Acl;
