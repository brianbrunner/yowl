# Yowl

Fast, minimal, multi-platform chatbot framework for NodeJS

## Example - A Simple Echo Bot

```js
var yowl = require('yowl');
var bot = yowl();

bot.name = "Echo Bot";

var local = require('yowl-platform-cli');
bot.extend(local);

bot.use(function(context, event, callback) {
  var message = event.message;
  event.send(context, event, message, callback);
});

bot.run();
```

```bash
$ npm install yowl yowl-platform-cli
$ node bot.js --local
```

## Installation

```bash
$ npm install yowl --save
```

## About

Yowl is a chatbot framework that is structured in a similar way to [express](https://github.com/expressjs/express).


It is unopinionated and comes with very little out of the box.
It allows you to chain together middleware that helps you do things like

  * connect to chat platforms
  * run classifiers on in-bound messages
  * add persistentence
  * structure and manage multi-message dialogs

## Middleware

This is not necessarily an exhaustive list but rather a good starting point for tools you can use to build your bot.

### Platforms

To talk to your users, bots need to integrate with outside platforms.

  * [yowl-platform-cli](https://github.com/brianbrunner/yowl-platform-cli) - allows you to interact with a bot via the command line by using the `--local` flag

*planned middleware: facebook platform, telegram platform, rest platform, sms platform*

### Context Persistence

You will most likely want to maintain an on-going state for interactions your users have with your bot. These modules take care of that.

  * [yowl-context-memory](https://github.com/brianbrunner/yowl-context-memory) - in-memory context persistence. good for getting up and running with a development environment or for testing.
  * [yowl-context-rethink](https://github.com/brianbrunner/yowl-context-rethink) - good for deployed bots that may benefit from rethinkdb's ease of operation/scaling

### Interaction Locking

Often you'll wait your bot to perform an asynchronous call to an external API or send multiple messages in reply to a user query. Locking allows you to limit a user to one active request at a time.

  * [yowl-lock-redis](https://github.com/brianbrunner/yowl-lock-redis) - locking backed by redis, based on the nodejs [redlock](https://github.com/mike-marcacci/node-redlock) implementation

*planned middleware: in-memory locking*

### Interaction Management

Bots aren't useful if they can't handle multi-step interactions with your users.

  * [yowl-dialog-manager](https://github.com/brianbrunner/yowl-dialog-manager) - a structured approach for defining and chaining dialogs, making it easier to create complex workflows for your bot

## Examples

Examples can be found at [brianbrunner/yowl-examples](https://github.com/brianbrunner/yowl-examples).

## Tests

As you can see, there are currently no tests. This is bad and will be rectified soon (the project is literally four days old).

## People

The author of Yowl is [Brian Brunner](https://github.com/brianbrunner)

## License

  [MIT](LICENSE)
