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

var debug = require('debug')('router');
var Route = require('./route');

/**
 * Initialize a new `Router` with the given `options`.
 *
 * @param {Object} options
 * @return {Router} which is a callable function
 * @public
 */

var proto = module.exports = function(options) {

  function router(context, event, next) {
    router.handle(context, event, next);
  }

  // mixin Router class functions
  router.__proto__ = proto;

  router.options = options;
  router.stack = [];

  return router;
};

/**
 * Dispatch a context, event into the router.
 * @private
 */

proto.handle = function handle(context, event, nextAfterDone) {
  var self = this;

  var idx = 0;
  var stack = this.stack;
  var stack_unroll = [];

  next(null, nextAfterDone);

  function next(err, callback) {
    var routeError = err;
    if (typeof callback === "function") {
      stack_unroll.push(callback);
    }

    var route;
    var shouldRun;

    while (shouldRun !== true && idx < stack.length) {
      route = stack[idx++];
      shouldRun = testShouldRun(route, context, event);

      if (typeof shouldRun !== "boolean") {
        routeError = routeError || shouldRun;
      }

      if (shouldRun !== true) {
        continue;
      }

      if (routeError) {
        shouldRun = false;
        continue;
      }

    }

    if (shouldRun !== true) {
      unroll(routeError);
      return;
    }

    route.handle_interaction(context, event, next);
  }

  next.unroll = unroll;

  function unroll(err) {
    if (stack_unroll.length === 0) {
      return;
    }  

    var fn = stack_unroll.pop();
    if (fn.length == 3) {
      fn(context, event, unroll);
    } else if (fn.length == 4) {
      fn(err, context, event, unroll);
    } else {
      unroll();
    }
  }

};


/**
 * Use the given middleware function, with an optional test parameter
 *
 * Test can be a boolean, a function or (in the future) an object. Test
 * is used to determine whether or not a function should be run.
 *
 * @public
 */

proto.use = function use(test, fn) {
  if (typeof fn === "undefined" && typeof test === "function") {
    fn = test;
    test = true;
  }

  if (typeof fn !== "function") {
    throw new TypeError('Router.use() requires a middleware function');
  }

  var route = new Route(test, {}, fn);
  this.stack.push(route);

  return this;
};

/**
 * Test if a route should be run.
 *
 * @param {Context} context
 * @param {Event} event
 * @param {Route} route
 * @private
 */

function testShouldRun(route, context, event) {
  try {
    return route.shouldRun(context, event);
  } catch (err) {
    return err;
  }
}
