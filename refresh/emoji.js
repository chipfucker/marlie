import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
const __dirname = import.meta.dirname;
import { setTimeout as wait } from "node:timers/promises";
import secrets from "../secrets.json" with { type: "json" };

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`\x1b[91m\x1b[1mRFS\x1b[0m deleting emojis`);
	await client.application.emojis.fetch()
		.then(emojis => emojis.forEach(emoji => emoji.delete()));
	console.log("    deleted emojis");

	console.log(`\x1b[91m\x1b[1mRFS\x1b[0m creating emojis`);
	await wait(2000).then(() => console.log("    2 seconds elapsed")).catch(console.error);
	const json = {};
	const dirPath = path.join(__dirname, "/../resource/emoji");
	const dir = fs.readdirSync(dirPath);

	for (const file of dir) {
		const filename = file.replace(/(.*)\.png/, "$1");
		const emoji = await client.application.emojis.create({
			attachment: path.join(dirPath, file),
			name: filename
		}).then(emoji => emoji.toString());
		const keys = filename.split("_");
		keys.reduce((obj, key, index) => {
			if (index === keys.length - 1) obj[key] = emoji;
			else {
				if (!obj[key]) obj[key] = {};
				return obj[key];
			}
		}, json);
	}
	console.log(json);
	fs.writeFileSync("util/emoji.json", JSON.stringify(json, null, "\t"));
	client.destroy();
});

client.login(secrets.discord.token);