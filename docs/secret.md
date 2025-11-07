# Secrets

Secrets are used to access bot tokens, users, channels, keys, and other special
things.

## Structure

```ts
{
    "UserAgent": <String>, // user agent used with restrictive requests
    "discord": {
        "token": <String>,           // bot token used to login
        "app_id": <Snowflake>,       // id of application; bot user
        "admin_server": <Snowflake>, // server with special administrative commands
        "user": {
            "main": <Snowflake> // main user
        },
        "channel": {
            "testing": <Snowflake>,       // channel for bot testing
            "announcements": <Snowflake>, // channel to send marlie announcements in
			"main": <Snowflake>,          // channel for main commands
			"nsfw": <Snowflake>,          // channel for NSFW commands
			"knit": <Snowflake>,          // forum channel for search threads
			"knit_tags": {
				"TEST": <Snowflake>,      // label forums for bot testing
				"Sampling": <Snowflake>,  // label forums used to test a search's waters
				"Tour": <Snowflake>,      // label searches used to find other tags or sources
				"Exhausted": <Snowflake>, // label forums that have yielded all of their search results
				"Goated": <Snowflake>,    // label goated searches
				"Mediocre": <Snowflake>,  // label searches that only sometimes yield good results
				"Bad": <Snowflake>,       // label searches that aren't worth continuing
				"...with good tags": <Snowflake> // clarify a search is only as good with certain tags
			},
			"hunt_forum": <Snowflake>, // forum channel for hunting image sources
			"hunt_forum_tags": {
				"Hunting": <Snowflake>, // label hunts in progress
				"Found": <Snowflake>,   // label successful hunts
				"Lost": <Snowflake>     // label given-up hunts
			},
			"save": <Snowflake>, // channel for queueing items to save
			"pack": <Snowflake>, // channel for queueing links to look into
			"hunt": <Snowflake>, // channel for queueing images to find the source of
			"tour": <Snowflake>, // channel to send links with many source possibilities
			"hold": <Snowflake>  // channel to send items to watch later
		}
	},
	"rule34": {
		"api_key": <String>,  // api_key param for rule34 api requests
		"user_id": <Number>,  // user_id param for api requests and request header for post requests
		"pass_hash": <String> // pass_hash request header for post requests
	}
}
```

Snowflake vales are automatically coerced into strings, so they can be written
with or without quotes, i.e. as strings or numbers.