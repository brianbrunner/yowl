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

var _ = require('lodash');
var util = require('util');

/**
 * Context prototype
 */

var context = module.exports = {};

/**
 *
 */

context.get = function get(name, defaultVal) {
  if (name in this) {
    return this[name];
  } else {
    return defaultVal;
  }
};

/**
 * Assign properties to a context with another object
 * @public
 */

context.assign = context.extend = function assign(object) {
  _.assign(this, object);
};

/**
 * Merge a context with another object
 * @public
 */

context.merge = function merge(object) {
  _.merge(this, object);
};

/**
 * Dump a context to an object
 *
 * This function returns a cleaned version of the context.
 * The cleaned object does not have any functions or internal
 * values. This is useful for persisting a context so it can
 * be reoladed later.
 *
 * @public
 */

context.dump = function dump() {
  return JSON.parse(this.jsonDump());
};

/**
 * Dump a context to a JSON string
 * @private
 */

context.jsonDump = function jsonDump() {
  var cache = [];

  // remove event temporarily
  var event = this.event;
  delete this.event;

  var contextJSON = JSON.stringify(this, function(key, value) {
    if (key.charAt(0) != '_') {
      if (typeof value === "object" && value !== null) { 
        if (cache.indexOf(value) !== -1) {
          return;
        }
        cache.push(value);
      }
      return value;
    }
  });

  // add event back
  this.event = event;

  return contextJSON;
};
