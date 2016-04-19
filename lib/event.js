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

/**
 * Event prototype
 */

var event = module.exports = {};


/**
 *
 */

event.get = function get(name, defaultVal) {
  if (name in this) {
    return this[name];
  } else {
    return defaultVal;
  }
};

/**
 *
 */

event.send = function send(context, event, response, callback) {
  if (typeof response === "object") {
    response.message = interpolate(context, response.message);
  } else if (typeof response === "string") {
    response = interpolate(context, response);
  }
  this.context._platform.send(context, event, response, function(err) {
    if (typeof callback === "function") {
      callback(err);
    }
  });
};

/**
 *
 */

function interpolate(context, message) {
  return message.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = context;
      b.split('.').forEach(function(part) {
        r = r[part];
      });
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
}
