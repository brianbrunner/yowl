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
var express = require('express');
var prepare = require('./middleware/prepare');
var Router = require('./router');

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
  this.app.express = express

  // Setup default configurations
  this.extensions = [];
  this.router_options = {};

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
    this._router.use(prepare.init(this));
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

  router.handle(context, event, function(err, context, event, nocall) {
    if (err) {
      logError("Encountered Error Handling Message", err, context, event);
    }
    try {
      callback(err, context, event, function(err) {
        if (err) {
          logError("Encountered Error After Calling Platform '" + context._platform.name + "' Callback", err, context, event);
        }
      });
    } catch(e) {
      logError("Encountered Error Calling Platform '" + context._platform.name + "' Callback", e, context, event);
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
  // Instantiate all extensions
  this.extensions.forEach(function(extension) {
    extension(this);
  }, this);

  // Start the express server
  this.server = this.app.listen.apply(this.app, arguments);
};

/**
 * Log Errors With Some Textual Context
 */

function logError(message, err, context, event) {
  if (err.stack) {
    console.error(err.stack);
  } else {
    console.error(err);
  }
  // TODO add cli options for logging out context and event as well
}
