/*!
 * yowl
 * Copyright(c) 2016 Brian Brunner
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

/**
 * Module exports.
 * @public
 */

module.exports = Route;

function Route(test, options, fn) {
  if (!(this instanceof Route)) {
    return new Route(test, options, fn);
  }

  this.options = options || {};
  this.handle = fn;
  this.name = fn.name || '<anonymous>';

  if (test === true) {
    this.always = true;
  } else if (test === false) {
    this.never = true;
  } else if (typeof test === 'function') {
    this.test_fn = test;
  }
  // TODO develop object based context/event checker
}

/**
 * Handle the interaction for the route.
 *
 * @param {Context} context
 * @param {Event} event
 * @param {Function} next
 * @api private
 */

Route.prototype.handle_interaction = function handle(context, event, next) {
  var fn = this.handle;

  if (fn.length > 3) {
    // not a standard interaction handler
    return next();
  }

  try {
    if (fn.length == 2) {
      fn(context, event);
      next();
    } else {
      fn(context, event, next);
    }
  } catch (err) {
    next(err);
  }
};


/**
 * Check if this route should be run.
 *
 * @param {Context} context
 * @param {Event} event
 * @return {Boolean}
 * @api private
 */

Route.prototype.should_run = function should_run(context, event) {
  if (this.always) {
    return true;
  } else if (this.never) {
    return false;
  } else if (this.test_fn) {
    return this.test_fn(context, event);
  } else {
    return false;
  }
};
