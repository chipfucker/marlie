To prevent the /hi message from being tracked without deleting it from the
repository, run the following Git command.

```bash
git update-index --assume-unchanged src/command/hi/message.js
```