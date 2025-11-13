# hi

`hi` is a command made to fuck with friends. It's intended to fake a bot
interaction with a custom message.

It imports from its sibling `content.js` file and replies to the interaction
using the `message` property.

## Setup

There is some optional setup involved if you intend on committing changes in any manner.

If you want to prevent changes to `content.js` from being tracked without
removing the file from the repository, firstly make sure that the file is set to
the default you prefer, so that those who clone the repo and use this command
will be met with that message by default.

Then, to untrack changes, run the following command.

```bash
git update-index --assume-unchanged src/command/hi/content.js
```

This is preferable to adding the file to `.gitignore`, as doing so will remove
it from the repository and render this command dysfunctional on first clone.