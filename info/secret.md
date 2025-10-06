# Secret file structure

`secret.json` is the root-level file used to store secure info such as account
tokens, cookie values, API keys, or server/channel IDs.

## Importing

```js
import secret from "#root/secret.json" with { type: "json" };
```

It can also be imported with a relative or root path.

```js
import secret from "./secret.json" with { type: "json" };
// Assuming this file is adjacent to `secret.json`
```

## Structure

```json
{
	"discord": {
		"token": string,
		"guildId": snowflake,
		"channel": {
			"save": { "id": snowflake },
			"pack": { "id": snowflake }
		},
		"user": {
			"main": snowflake
		}
	},
	"rule34": {
		"api_key": string,
		"user_id": string
	}
}
```

### Values

* `discord`
  * `token` The bot's login token.
  * `guildId` The ID of the guild with special administrative commands.
  * `channel`
    * `save.id` The ID for the channel where saves should be sent.
	* `pack.id` The ID for the channel where packs should be sent.
  * `user`
    * `main` The ID for the main account.
* `rule34`
  * `api_key` The hexadecimal API key used with Rule34 requests.
  * `user_id` The ID of the user to be associated with the API requests.