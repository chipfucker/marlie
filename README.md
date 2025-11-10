# Marlie

Marlie is a bot I've written for my own fun and utility.

## Q&A

If you have any questions about this bot, and they are not answered here, shoot
me a message at @chiptumor on Discord. I love answering questions, stupid and
intellectual.

- **Can I install this application with my user?**

  No. If you want to use this bot yourself, you'll have to commit to some finnicky
  setting up. More about that under ["Can I download and run this bot with my own
  Discord application?"]

  - **Can I download and run this bot with my own Discord application?**

    I couldn't care less. Use this bot however you want to, but be wary I am not a
    professional coder, and there will be plenty that isn't optimized for day-to-day
    or widespread use.

    If you truly want to download this bot and run it yourself with your own Discord
    application, my messages are open for help. However, if you need a full tutorial
    on setting up a Discord bot, I will not be the one to guide you. My messages are
    open only assuming you know what you're doing to an extent and are only
    struggling with a tidbit that you need my help specifically with.

    - **Should I credit? Who?**

      Wherever you choose to credit, I'm @chiptumor on Discord. You can also link to
      this repo, [chipfucker/marlie], my GitHub profile, [github.com/chiptumor], or
      [github.com/chipfucker] if you'd prefer to link to my unsavory org.

      If you're running this bot simply using the source code, no credits are needed;
      if anyone asks, I'd prefer you not gatekeep and at least say 'oh, this
      'chiptumor' guy made it' and link to the repository where necessary, but it's
      not something I plan on taking action against, so long as you don't say 'I made
      it' or you've created a plot gap that people are begging for the answer to.

      If you're forking this repo to host your own version of Marlie, be sure you're
      legitimately forking it so that GitHub displays your repo is forked from
      chipfucker/marlie. Same above applies&mdash;if you're not linking to or
      crediting anything in your bot's profile, a simple response of 'fork of
      chiptumor's bot' and a link to either your or my repo should do.

      To make it apparent, in case it isn't already: **please do not take credit for
      my work!** Go ham, really, but if you're going to credit anyone, credit me for
      the foundation, and only take credit for whatever you've added or tweaked.

- **What's this weird code thing in some of your messages?**
  
  Oh, you mean like this?

  ```json
  {"query":"angstrom","dir":0}
  ```

  That's JSON code! I put that in the message so I don't have to store it in
  memory. The bot's memory is reset when I restart the program, so if I stored it
  in memory, that data would very easily be lost, and the bot wouldn't know what
  to do when it's being told to do things like go to the next post.

  - **What's that mean?**

    JSON stands for JavaScript Object Notation; a JSON object is a piece of code
    that makes accessing some data easier.

    The above code is compacted to an almost illegible state, but it can be
    rewritten to be more human-legible. The below code is exactly equivalent.

    ```json
    {
      "query": "angstrom",
      "dir": 0
    }
    ```
    
    [Read more about JSON here.]

  - **No, I mean the memory part.**

    Most Discord bots save data&mdash;like user preferences and search
    results&mdash;to memory, meaning the program that runs the bot keeps that data
    to itself, a lot like human memory, which they access when certain things are
    requested of them, like sending a configured default welcome message, or
    flipping to the next result of a search.

    The reason I store data in messages instead of in memory is because, when a
    program is restarted, its memory is discarded, and it doesn't remember a thing
    when you turn it back on. I restart my bot very often, so almost never will it
    be able to access data like that when requested.

    The cool side effect of doing this is that (so long as the bot is online) no
    matter how old a message is, its components, like its buttons and inputs, will
    always work, because all it has to do is look at the message of the button you
    clicked on, nab that piece of code, and use it accordingly! I don't have to make
    any sacrifices to store data on my machine; all the data is stored on Discord's
    end. [Losers!]

[chipfucker/marlie]: https://github.com/chipfucker/marlie
[github.com/chiptumor]: https://github.com/chiptumor
[github.com/chipfucker]: https://github.com/chipfucker

["Can I download and run this bot with my own Discord application?"]: #:~:text=Can%20I%20download%20and%20run%20this%20bot%20with%20my%20own%20Discord%20application%3F
[Read more about JSON here.]: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON
[Losers!]: https://discord.com/blog/how-discord-stores-trillions-of-messages
