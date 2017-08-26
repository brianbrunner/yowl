# Capabilities

Yowl attempts to create an abstraction layer on top of each messaging platform so that
you can concern yourself with building your bot, rather than integrating directly with
each platform. Each platform has capabilities that it supports, which are exposed for
inspection via the aptly named `platform.capabilities` array.

## Checking for Capabilities

    bot.use(function(context, event) {
      if (context.platforms.capabilities.includes('actions')) {
        event.send({
          message: "Please make a choice",
          actions: [
            "Choice A",
            "Choice B"
          ]
        });
        // In your response handler, look for `event.action`
      } else {
        event.send("Please make a choice: Choice A of Choice B");
        // In your response handler, parse the message for A or B
      }
    });

## List of Capabilities

### say

`say` is the most basic capability: the ability to send a message. It is more or less
required for all platforms, so you shouldn't need to check for it. Say can be leveraged
one of two ways.

    // Object-based
    event.send({ message: "Something to say" });

    // Directly a string
    event.send("Something to say");

### actions

`actions` is one step up from say. most platforms should support this organically through
buttons (as is the case with `yowl-platform-facebook` or artificially via numbered inputs
(as is the case with `yowl-platform-cli`).

#### string action

The simplest type of action is the string action.

    // String actions
    event.send({
      message: "Something to say",
      actions: [
        "First Choice",
        "Second Choice",
        "Third Choice",
      ]
    });

When the user selects one of these options, you will receive the same value back for
`event.action` in your handler, as in, the literal string `"First Choice"`.

#### object action

    // Object-based actions
    event.send({
      message: "Something to say",
      actions: [
        {
          title: "First Choice",
          payload: "first"
        },
        {
          title: "First Choice",
          payload: "second"
        },
        {
          title: "third Choice",
          payload: "third"
        },
      ]
    });

The user will be shown `action.title` in their client. When the user selects one of 
these options, you will receive `action.payload` back for `event.action` in your handler,
as in, the literal string `"first"`.

#### url action

    event.send({
      message: "Something to say",
      actions: [
        {
          title: "Yowl Documentation",
          url: "https://github.com/brianbrunner/yowl"
        }
      ]
    });

When the user selects this option, they will be taken to the url provided.

#### combining action types

You may combine all types of actions for any call to `event.send`.

### typing

Some platforms allow you to show the user that you are typing.

  // Start typing
  event.send({
    typing: true
  });

  // Stop typing
  event.send({
    typing: false
  });

You probably don't need to use this directly as `yowl-dialog-manager`
takes care of it for you.
