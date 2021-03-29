const errors = require('./errors');
const utils = require('./utils');

/**
 * Key/Value store
 */
class Kv {
  constructor(consul) {
    this.consul = consul;
  }

  /**
   * Get
   */
  get(opts) {
    if (typeof opts === 'string') {
      opts = { key: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'kv.get',
      path: '/kv/{key}',
      params: { key: (opts.key || '') },
      query: {},
    };

    if (opts.recurse) req.query.recurse = 'true';
    if (opts.raw) {
      req.query.raw = 'true';
      req.buffer = true;
    }

    utils.options(req, opts);

    return this.consul._get(req, function(request, next) {
      const res = request.res;

      if (res && res.statusCode === 404) return next(false, undefined);;
      if (request.err) return next(err, undefined);
      if (opts.raw) return next(false, res.body);

      if (res.body && Array.isArray(res.body) && res.body.length) {
        res.body.forEach((item) => {
          if (item.hasOwnProperty('Value')) {
            item.Value = utils.decode(item.Value, opts);
          }
        });
      } else {
        return next(false, undefined);
      }

      if (!opts.recurse) return next(false, res.body[0]);

      next(false, res.body);
    });
  }

  /**
   * Keys
   */
  keys(opts) {
    if (typeof opts === 'string') {
      opts = { key: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'kv.keys',
      path: '/kv/{key}',
      params: { key: (opts.key || '') },
      query: { keys: true },
    };

    if (opts.separator) req.query.separator = opts.separator;

    utils.options(req, opts);

    return this.consul._get(req, utils.body);
  }

  /**
   * Set
   */
  set(opts) {
    let options;
    switch (arguments.length) {
      case 3:
        // set(key, value, opts)
        options = arguments[2];
        options.key = arguments[0];
        options.value = arguments[1];
        break;
      case 2:
        // set(key, value)
        options = {
          key: arguments[0],
          value: arguments[1],
        };
        break;
      default:
        options = opts;
    }

    options = utils.normalizeKeys(options);
    options = utils.defaults(options, this.consul._defaults);

    const req = {
      name: 'kv.set',
      path: '/kv/{key}',
      params: { key: options.key },
      query: {},
      type: 'text',
      body: options.value || '',
    };

    if (!options.key) {
      throw this.consul._err(errors.Validation('key required'), req);
    }
    if (!options.hasOwnProperty('value')) {
      throw this.consul._err(errors.Validation('value required'), req);
    }

    if (options.hasOwnProperty('cas')) req.query.cas = options.cas;
    if (options.hasOwnProperty('flags')) req.query.flags = options.flags;
    if (options.hasOwnProperty('acquire')) req.query.acquire = options.acquire;
    if (options.hasOwnProperty('release')) req.query.release = options.release;

    utils.options(req, options);

    return this.consul._put(req, utils.body);
  }

  /**
   * Delete
   */
  del(opts) {
    if (typeof opts === 'string') {
      opts = { key: opts };
    }

    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'kv.del',
      path: '/kv/{key}',
      params: { key: (opts.key || '') },
      query: {},
    };

    if (opts.recurse) req.query.recurse = 'true';

    if (opts.hasOwnProperty('cas')) req.query.cas = opts.cas;

    utils.options(req, opts);

    return this.consul._delete(req, utils.body);
  }

  delete(opts) {
    return this.del.apply(this, arguments);
  }
}

exports.Kv = Kv;
