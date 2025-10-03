import * as Discord from "discord.js";
import Sharp from "sharp";
import * as fs from "node:fs";
import { posix as path } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.refresh;
import secret from "../secret.json" with { type: "json" };

const client = new Discord.Client({ intents: [ Discord.GatewayIntentBits.Guilds ] });
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`${tag} deleting emojis`);
	await client.application.emojis.fetch()
		.then(emojis => emojis.forEach(emoji => await emoji.delete()));
	console.log(`${sub} deleted emojis`);

	console.log(`${tag} creating emojis`);
	await wait(2000).then(() => console.log(`${sub} 2 seconds elapsed`)).catch(console.error);
	const json = {};
	const dirPath = path.resolve("resource/emoji");
	const dir = fs.readdirSync(dirPath);

	for (const file of dir) {
		const name = path.basename(file, ".png");
		const buffer = new Sharp(path.join(dirPath, file));
		const metadata = await buffer.metadata();
		const resized = await buffer.resize({
			width: metadata.width * 8,
			height: metadata.height * 8,
			kernel: "nearest"
		}).toBuffer();
		const emoji = await client.application.emojis.create({
			attachment: resized,
			name: name
		}).then(emoji => emoji.toString());
		const keys = name.split("_");
		keys.reduce((obj, key, index) => {
			if (index === keys.length - 1) {
				const match = key.match(/^(.+?)(\d+)?$/);
				if (match[2] === "0") obj[match[1]] = emoji;
				else if (match[2]) obj[match[1]] += emoji;
				else obj[key] = emoji;
			} else {
				obj[key] ??= {};
				return obj[key]; // TODO: see if you can just return {}
			}
		}, json);
	}
	fs.writeFileSync("util/emoji.json", JSON.stringify(json, null, "\t"));
	console.log(`file://${path.resolve("util/emoji.json")} updated`);
	client.destroy();
});

client.login(secret.discord.token);