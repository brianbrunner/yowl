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
    this.testFn = test;
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
    fn(context, event, next);
  } catch (err) {
    next(err);
  }
};


/**
 * Check if this route should be run.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Route.prototype.shouldRun = function shouldRun(context, event) {
  if (this.always) {
    return true;
  } else if (this.never) {
    return false;
  } else if (this.testFn) {
    return this.testFn(context, event);
  } else {
    return false;
  }
};
