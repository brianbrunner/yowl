/*!
 * yowl
 * Copyright(c) 2016 Brian Brunner
 * MIT Licensed
 */

'use strict';

/**
 *
 */

exports.init = function(bot) {
  return function yowlInit(context, event, next) {
    context.session = context.session || {};
    context.__proto__ = bot.context;
    event.__proto__ = bot.event;
  
    context.event = event;
    event.context = context;

    next();
  };
};
