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
 * Get a unique id for this context
 */

context.uniqueId = function uniqueId() {
  return this.platform.name + "|" + this.sessionId;
};

/**
 * Assign properties to a context with another object
 * @public
 */

context.assignSession = context.extendSession = function assignSession(object) {
  if (!this.session) {
    this.session = object;
  } else {
    _.assign(this.session, object);
  }
};

/**
 * Merge a context with another object
 * @public
 */

context.mergeSession = function mergeSession(object) {
  if (!this.session) {
    this.session = object;
  } else {
    _.merge(this.session, object);
  }
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

context.dumpSession = function dumpSession() {
  return JSON.parse(this.jsonDumpSession());
};

/**
 * Dump a context to a JSON string
 * @private
 */

context.jsonDumpSession = function jsonDumpSession() {

  if (!this.session) {
    throw new Error("There is no session to dump");
  }

  var cache = [];

  // remove event temporarily
  var event = this.event;
  delete this.event;

  var contextJSON = JSON.stringify(this.session, function(key, value) {
    if (typeof value === "object" && value !== null) { 
      if (cache.indexOf(value) !== -1) {
        return;
      }
      cache.push(value);
    }
    return value;
  });

  // add event back
  this.event = event;

  return contextJSON;
};
