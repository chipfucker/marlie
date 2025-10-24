# Secret file structure

`secrets.json` is the root-level file used to store secure info such as account
tokens, cookie values, API keys, or server/channel IDs.

## Importing

```js
import secret from "#root/secrets.json" with { type: "json" };
```

It can also be imported with a relative or root path.

```js
import secret from "./secrets.json" with { type: "json" };
// Assuming this file is adjacent to `secrets.json`
```

## Structure

```json
{
	"user": {
		"main": snowflake,
		"nsfw": snowflake,
		"roleplay": snowflake,
		"old": snowflake
	},
    "UserAgent": string,
	"discord": {
		"token": string,
		"clientId": snowflake,
		"guildId": snowflake,
		"channel": {
			"marlie_testing": { "id": snowflake },
			"marlie_announcements": { "id": snowflake },
			"marlie": { "id": snowflake },
			"marlie_nsfw": { "id": snowflake },
			"knit": {
				"id": snowflake,
				"tags": {
					"Artist": snowflake,
					"Character": snowflake,
					"General": snowflake,
					"Goated": snowflake,
					"Bad": snowflake,
					"Exhausting": snowflake,
					"Sampling": snowflake,
					"TEST": snoaflake
				}
			},
			"hunting": {
				"id": snowflake,
				"tags": {
					"Found": snowflake,
					"Hunting": snowflake,
					"Lost": snowflake,
					"Marlie": snowflake,
					"Lawliet": snowflake
				}
			},
			"saves": { "id": snowflake },
			"packs": { "id": snowflake },
			"hunts": { "id": snowflake },
			"holds": { "id": snowflake },
			"tours": { "id": snowflake }
		}
	},
	"rule34": {
		"api_key": string,
		"user_id": string,
		"pass_hash": string
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