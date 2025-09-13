# Marlie

## Q&A

### Can I install this bot for my use?

No.

### What's this weird code thing above some of your commands?

That's JSON code! It's there so I don't have to save it in memory.

#### What's that mean?

JSON stands for JavaScript Object Notation; a JSON object is a little piece of
code that makes accessing some data easier.

#### No, I mean the memory part.

Most Discord bots save data, like user preferences and requested data, to
memory, so they can access it later without displaying it to the user.

The reason I prefer to store data in the message is because I tend to refresh
Marlie a *lot,* which discards any data in memory, and would render things that
would normally require memory impossible to use properly.

The cool side effect of doing this is that no matter how old a command used in
chat is, as long as the bot is online, its buttons and stuff will *always*
work! I don't have to make any sacrifices to store data on my machine; all the
data is tied to the message.