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

event.send = function send(response, callback) {
  if (typeof response === "object" && response.message) {
    response.message = interpolate(this.context.session, response.message);
  } else if (typeof response === "string") {
    response = interpolate(this.context.session, response);
  }
  this.context.platform.send(this.context, this, response, function(err) {
    if (typeof callback === "function") {
      callback(err);
    }
  });
};

/**
 *
 */

function interpolate(session, message) {
  return message.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = session;
      b.split('.').forEach(function(part) {
        r = r[part];
      });
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
}
