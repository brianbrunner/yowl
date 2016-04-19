/*!
 * yowl
 * Copyright(c) 2016 Brian Brunner
 * MIT Licensed
 */

'use strict';

/**
 * Module Dependencies
 */

var context = require('./context');
var event = require('./event');
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./bot');

/**
 * Expose `createBot()`
 */

exports = module.exports = createBot;

/**
 * Creates a bot.
 *
 * @return {Function}
 * @api public
 */

function createBot() {
  var bot = function(platform, context, event, next) {
    context._platform = platform;
    bot.handle(context, event, next);
  };

  mixin(bot, EventEmitter.prototype, false);
  mixin(bot, proto, false);

  bot.context = { __proto__: context, bot: bot };
  bot.event = { __proto__: event, bot: bot };
  bot.display_name = "bot"; // default, should be overwritten
  bot.init();
  return bot;
}


/**
 * Expose the prototypes.
 */

exports.bot = proto;
exports.context = context;
exports.event = event;
