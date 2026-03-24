# Marlie

Marlie is a bot I've written for my own fun and utility.

## Q&A

<large>

You can find me on Discord at `chiptumor`.

</large>

If you need any extra info, or if you need to contact me for any other reason,
feel free to shoot me a friend request and/or message.

- <details>
  <summary>
  
  **Where's the official instance of Marlie?**

  </summary>

  I'm not currently hosting Marlie. It's all just source code that I compile and
  run on my own computer when I want to use it. More info will be provided on
  using Marlie when it's published.

  </details>

- <details>
  <summary>
  
  **Can I build and host my own instance of Marlie?**

  </summary>

  You may, but I ask that you notify me before doing so. I worry my work will be
  let loose to the public without my name attributed to it.
  
  You should also be wary that I do not have a degree in programming, and that
  the way I handle things may be slow or confusing. This project's state is
  still very indev, and I am currently not appreciative of issues.

  If you need guidance on setting up this bot, my Discord messages are open for
  help. If your need for guidance encompasses more than specifics about setting
  up Marlie, such as setting up Node.js, NPM projects, or compiling TypeScript,
  please make an effort to figure that part out on your own.

  - <details>
    <summary>
    
    **Who should I credit?**

    </summary>

    This question would be better resolved by contacting me directly.

    If a situation occurs, please link to my [GitHub], [Discord], [Instagram],
    or [Twitter] &mdash; my handle on each of those, and most other sites, is
    `chiptumor`.

    [GitHub]: <https://github.com/chiptumor>
    [Discord]: <https://discord.com/users/> "To be added"
    [Instagram]: <https://instagram.com/chiptumor>
    [Twitter]: <https://twitter.com/chiptumor>

    Wherever you choose to credit, I'm @chiptumor on Discord. You can also link to
    this repo, [chipfucker/marlie], my GitHub profile, [github.com/chiptumor], or
    [github.com/chipfucker] if you'd prefer to link to my unsavory org.

    <!-- If you're running this bot simply using the source code, no credits are needed;
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
    the foundation, and only take credit for whatever you've added or tweaked. -->

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
