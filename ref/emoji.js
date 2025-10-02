import * as Discord from "discord.js";
import Sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";
const __dirname = import.meta.dirname;
import { setTimeout as wait } from "node:timers/promises";
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.refresh;
import secret from "../secret.json" with { type: "json" };

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`${tag} deleting emojis`);
	await client.application.emojis.fetch()
		.then(emojis => emojis.forEach(emoji => emoji.delete()));
	console.log(`${sub} deleted emojis`);

	console.log(`${tag} creating emojis`);
	await wait(2000).then(() => console.log(`${sub} 2 seconds elapsed`)).catch(console.error);
	const json = {};
	const dirPath = path.join(__dirname, "/../resource/emoji");
	const dir = fs.readdirSync(dirPath);

	for (const file of dir) {
		const filename = file.replace(/(.*)\.png/, "$1");
		const buffer = new Sharp(path.join(dirPath, file));
		const metadata = await buffer.metadata();
		const resized = await buffer.resize({
			width: metadata.width * 8,
			height: metadata.height * 8,
			kernel: "nearest"
		}).toBuffer();
		const emoji = await client.application.emojis.create({
			attachment: resized,
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

client.login(secret.discord.token);