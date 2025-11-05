# Secret file structure

`secrets.js` is the root-level file used to store secure info such as account
tokens, cookie values, API keys, or server/channel IDs.

## Importing

```js
import secret from "#/secrets.js" with { type: "json" };
```

## Structure

```ts
// Tokens and IDs for bot
export const Bot = {
	token: <String>, // Login token
	guildId: <String> // ID of admin guild
};

// IDs of channels
export const Channel = {
	testing: <String>, // For bot testing
	forum: <String>, // For forum searches
	forumTags: [ // Tags for forum channel
		
	]
	save: <String>, // For saving
	pack: <String>, // For inspecting
	hunt: <String>, // For image searching
	tour: <String>, // For source exploring
	hold: <String>  // For watching later
};

// IDs of accounts
export const User = {
	main: <String> // Main
};

// Keys and tokens for rule34.xxx
export const Rule34 = {
	api_key: <String>, // api_key search param
	user_id: <String|Number> // user_id search param
}
```