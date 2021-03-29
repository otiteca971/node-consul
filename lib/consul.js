const papi = require('papi');

const Acl = require('./acl').Acl;
const Agent = require('./agent').Agent;
const Catalog = require('./catalog').Catalog;
const Event = require('./event').Event;
const Health = require('./health').Health;
const Kv = require('./kv').Kv;
const Lock = require('./lock').Lock;
const Query = require('./query').Query;
const Session = require('./session').Session;
const Status = require('./status').Status;
const Watch = require('./watch').Watch;
const Transaction = require('./transaction').Transaction;
const utils = require('./utils');

/**
 * Consul client
 */
class Consul extends papi.Client {
  constructor(opts) {
    opts = utils.defaults({}, opts);

    if (!opts.baseUrl) {
      opts.baseUrl = (opts.secure ? 'https:' : 'http:') + '//' +
        (opts.host || '127.0.0.1') + ':' +
        (opts.port || 8500) + '/v1';
    }
    opts.name = 'consul';
    opts.type = 'json';

    if (opts.defaults) {
      const defaults = utils.defaultCommonOptions(opts.defaults);
      if (defaults) this._defaults = defaults;
    }
    delete opts.defaults;

    super(opts);

    this.acl = new Acl(this);
    this.agent = new Agent(this);
    this.catalog = new Catalog(this);
    this.event = new Event(this);
    this.health = new Health(this);
    this.kv = new Kv(this);
    this.query = new Query(this);
    this.session = new Session(this);
    this.status = new Status(this);
    this.transaction = new Transaction(this);
  }

  lock(opts) {
    return new Lock(this, opts);
  }

  watch(opts) {
    return new Watch(this, opts);
  }

  parseQueryMeta(res) {
    return utils.parseQueryMeta(res);
  }
}

exports.Consul = Consul;
