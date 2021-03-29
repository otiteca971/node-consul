const CatalogConnect = require('./catalog/connect').CatalogConnect;
const CatalogNode = require('./catalog/node').CatalogNode;
const CatalogService = require('./catalog/service').CatalogService;
const utils = require('./utils');

/**
 * Manage catalog
 */
class Catalog
  constructor(consul) {
    this.consul = consul;

    this.connect = new CatalogConnect(consul);
    this.node = new CatalogNode(consul);
    this.service = new CatalogService(consul);
  }

  /**
   * Lists known datacenters
   */
  datacenters(opts) {
    opts = utils.normalizeKeys(opts);
    opts = utils.defaults(opts, this.consul._defaults);

    const req = {
      name: 'catalog.datacenters',
      path: '/catalog/datacenters',
    };

    utils.options(req, opts);

    return this.consul._get(req, utils.body);
  }

  /**
   * Lists nodes in a given DC
   */
  nodes() {
    return this.node.list.apply(this.node, arguments);
  }

  /**
   * Lists services in a given DC
   */
  services() {
    return this.service.list.apply(this.service, arguments);
  }
}

exports.Catalog = Catalog;
