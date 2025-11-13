# Secrets

Secrets are used to access bot tokens, users, channels, keys, and other special
things.

## Structure

```ts
{
    "UserAgent": <String>, // user agent used with requests that require them
    "discord": {
        "token": <String>,           // bot token used to login
        "app_id": <Snowflake>,       // id of application; bot user
        "admin_server": <Snowflake>, // server with special administrative commands
        "user": {
            "main": <Snowflake> // main user
        },
        "channel": {
			// channel for bot testing
			"testing": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// channel to send marlie announcements in
			"announcements": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// channel for main commands
			"main": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// channel for NSFW commands
			"nsfw": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// forum channel for search threads
			"knit": {
				"id": <Snowflake>,
				"emoji": <String>,
				"tags": {
					"TEST": <Snowflake>,      // label forums for bot testing
					"Sampling": <Snowflake>,  // label forums used to test a search's waters
					"Tour": <Snowflake>,      // label searches used to find other tags or sources
					"Exhausted": <Snowflake>, // label forums that have yielded all of their search results
					"Goated": <Snowflake>,    // label goated searches
					"Mediocre": <Snowflake>,  // label searches that only sometimes yield good results
					"Bad": <Snowflake>,       // label searches that aren't worth continuing
					"...with good tags": <Snowflake> // clarify a search is only as good with certain tags
				}
			},
			// forum channel for hunting image sources
			"hunt_forum": {
				"id": <Snowflake>,
				"emoji": <String>,
				"tags": {
					"Hunting": <Snowflake>, // label hunts in progress
					"Found": <Snowflake>,   // label successful hunts
					"Lost": <Snowflake>     // label given-up hunts
				}
			},
			// channel for queueing items to save
			"save": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// channel for queueing links to look into
			"pack": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// channel for queueing images to find the source of
			"hunt": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// channel to send links with many source possibilities
			"tour": {
				"id": <Snowflake>,
				"emoji": <String>
			},
			// channel to send items to watch later
			"bide": {
				"id": <Snowflake>,
				"emoji": <String>
			}
		}
	},
	"rule34": {
		"api_key": <String>,  // api_key param for rule34 api requests
		"user_id": <Number>,  // user_id param for api requests and request header for post requests
		"pass_hash": <String> // pass_hash request header for post requests
	}
}
```