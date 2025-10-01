import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
const __dirname = import.meta.dirname;
import { setTimeout as wait } from "node:timers/promises";
import secrets from "../secrets.json" with { type: "json" };

const tag = "\x1b[1;91mRFS\x1b[m";
const subtag = "   ";

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`${tag} deleting emojis`);
	await client.application.emojis.fetch()
		.then(emojis => emojis.forEach(emoji => emoji.delete()));
	console.log(`${subtag} deleted emojis`);

	console.log(`${tag} creating emojis`);
	await wait(2000).then(() => console.log(`${subtag} 2 seconds elapsed`)).catch(console.error);
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
	fs.writeFileSync("util/emoji.json", JSON.stringify(json, null, "\t"));
	console.log(`file:///${path.join(__dirname, "/../util/emoji.json")} updated`);
	client.destroy();
});

client.login(secrets.discord.token);