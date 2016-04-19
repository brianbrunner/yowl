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

## Tests

As you can see, there are currently no tests. This is bad and will be rectified soon (the project is literally four days old).

## Examples

Examples can be found at [brianbrunner/yowl-examples](https://github.com/brianbrunner/yowl-examples).

## People

The author of Yowl is [Brian Brunner](https://github.com/brianbrunner)

## License

  [MIT](LICENSE)
