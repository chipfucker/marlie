import * as Discord from "discord.js";
import Sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";
import { setTimeout as wait } from "node:timers/promises";

import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.refresh;
import secret from "../secret.json" with { type: "json" };

const client = new Discord.Client({ intents: [ Discord.GatewayIntentBits.Guilds ] });
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`${tag} deleting emojis`);
	const deleteEmojis = await client.application.emojis.fetch()
		.then(emojis => emojis.map(emoji => emoji.delete()));
	await Promise.all(deleteEmojis);
	console.log(`${sub} deleted emojis`);

	console.log(`${tag} creating emojis`);
	const json = {};
	const dirPath = path.resolve("resource/emoji");
	const dir = fs.readdirSync(dirPath, { recursive: true }).filter(file => file.match(/\./));

	for (const file of dir) {
		const sheet = path.dirname(file) === "spritesheet";
		const baseName = path.basename(file, ".png");

		const sharp = new Sharp(path.join(dirPath, file));
		const metadata = await sharp.metadata();
		const resized = await sharp.resize({
			height: Math.ceil(128 / metadata.height) * metadata.height,
			kernel: "nearest"
		}).toBuffer();

		if (sheet) {
			const sharpResized = new Sharp(resized);
			const metadata = await sharpResized.metadata();
			const slices = [...Array(metadata.width / metadata.height).keys()]
				.map(num => num * metadata.height);

			for (const index in slices) {
				const sharpResized = new Sharp(resized);
				const metadata = await sharpResized.metadata();
				const sprite = await sharpResized.extract({
					top: 0,
					left: slices[index],
					width: metadata.height,
					height: metadata.height
				}).toBuffer();

				const emoji = await client.application.emojis.create({
					attachment: sprite,
					name: baseName + ((sheet && index) || "")
				}).then(emoji => emoji.toString());

				const keys = baseName.split("_");
				keys.reduce((obj, key, nest) => {
					if (nest === keys.length - 1)
						if (index === 0) obj[key] = emoji;
						else obj[key] = (obj[key] || "") + emoji;
					else {
						obj[key] ??= {};
						return obj[key];
					}
				}, json);

				console.log(`${sub} ${sub} + ${emoji}`);
			}
		} else {
			const emoji = await client.application.emojis.create({
				attachment: resized,
				name: baseName
			}).then(emoji => emoji.toString());
			const keys = baseName.split("_");
			keys.reduce((obj, key, nest) => {
				if (nest === keys.length - 1) obj[key] = emoji;
				else {
					obj[key] ??= {};
					return obj[key];
				}
			}, json);

			console.log(`${sub} created emoji ${baseName}: ${emoji}`);
		}
	}
	fs.writeFileSync("util/emoji.json", JSON.stringify(json, null, "\t"));
	console.log(`${sub} file://${path.resolve("util/emoji.json")} updated`);
	client.destroy();
});

client.login(secret.discord.token);