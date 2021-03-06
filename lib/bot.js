/*!
 * yowl
 * Copyright(c) 2016 Brian Brunner
 * MIT Licensed
 */

'use strict';

/**
 * Module Dependencies
 * @private
 */

var bodyParser = require('body-parser');
var http = require('http');
var express = require('express');
var prepare = require('./middleware/prepare');
var Router = require('./router');
var uuidv4 = require('uuid/v4');

/**
 * Bot prototype
 */

var bot = module.exports = {};

/**
 * Initialize the bot
 *
 *   - Setup default configuration
 *   - Setup default middleware
 *   - Instantiate the built in express server
 *
 * @private
 */

bot.init = function init() {

  // Setup express
  this.app = express();
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(bodyParser.json());

  // Expose express in case we need it (static, etc)
  this.app.express = express;

  // Setup default configurations
  this.extensions = [];
  this.router_options = {};

  // Setup our default middleware
  this.prepare = prepare.init(this);

};

/**
 * Instantiate and memoize the base router
 *
 * This allows extensions to set options on the router
 * since we load the extensions before we instantiate the router
 *
 * @private
 */

bot.router = function router() {
  if (!this._router) {
    this._router = new Router(this.router_options);
    this._router.use(this.prepare);
  }
  return this._router;
};


/**
 * Dispatch a context, event pair into the bot. Starts the pipeline processing.
 *
 * @private
 */

bot.handle = function handle(context, event, callback) {
  var router = this._router;
  
  if (!router) {
    callback();
    return;
  }

  router.handle(context, event, function(err) {
    if (err) {
      logError("Encountered Error Handling Message", err, context, event);
    }
    try {
      callback(err, context, event, function(err) {
        if (err) {
          logError("Encountered Error After Calling Platform '" + context.platform.name + "' Callback", err, context, event);
        }
      });
    } catch(e) {
      logError("Encountered Error Calling Platform '" + context.platform.name + "' Callback", e, context, event);
    }
  }.bind(this));
};

bot.use = function use(test, fn) {

  var router = this.router();

  if (typeof fn === "undefined") {
    fn = test;
    test = true;
  }

  if (typeof fn !== "function") {
    throw new TypeError('bot.use() requires middleware functions');
  }

  if (!fn.handle || !fn.set) {
    return router.use(test, fn);
  }

  use.parent = this;
  use.test = test;

  router.use(test, function mounted_extension(context, event, next) {
    var orig = context.bot;
    fn.handle(context, event, function(err) {
      context.__proto__ = orig.context;
      event.__proto__ = orig.event;
      next(err);
    });
  });

};

/**
 * Add an extension to the bot.
 *
 * An extension is function that takes a bot 
 * instance and modifies or integrates with it 
 * in some way. Common examples are platform 
 * integrations, dialog managers, etc. An extension
 * function is run as part of `bot.run`.
 *
 * @public
 */

bot.extend = function extend(extension) {
  this.extensions.push(extension);
};

/**
 * Get a session id for this context.
 *
 * This method is used when the platfor does not provide a session id as is the 
 * case with websockets and web platforms. This should be overridden (i.e. monkeypatched) 
 * in production if you are using those platforms since uniqueness cannot be guaranteed
 * across multiple server instances.
 */

bot.generateSessionId = function generateSessionId() {
  return uuidv4();
}

/**
 * Run the bot
 *
 * All of the extensions are instantiated at 
 * this point. An express erver is start using
 * the arguments passed to this function as
 * well.
 *
 * @public
 */

module.exports.run = function run() {
  // Create a server
  this.server = http.createServer(this.app);

  // Instantiate all extensions
  this.extensions.forEach(function(extension) {
    extension(this);
  }, this);

  // Start the express server
  this.server.listen.apply(this.server, arguments);
};

/**
 * Log Errors With Some Textual Context
 */

function logError(message, err, context, event) {
  var current_err = err;
  while (current_err) {
    var next_err = current_err._previous;
    delete current_err._previous;
    if (current_err.stack) {
      console.error(current_err.stack);
    } else {
      console.error(current_err);
    }
    current_err = next_err;
  }
  // TODO add cli options for logging out context and event as well
}
