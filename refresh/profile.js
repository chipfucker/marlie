import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.refresh;
import secret from "../secret.json" with { type: "json" };

const client = new Discord.Client({ intents: [ Discord.GatewayIntentBits.Guilds ]});
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`${tag} setting profile`);
	try { await client.user.setAvatar("../resource/profile/avatar.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setAvatar();
		else throw error;
	}
	client.application.edit()
	console.log(`${sub} set avatar`);
	try { await client.user.setBanner("../resource/profile/banner.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setBanner();
		else throw error;
	}
	console.log(`${sub} set banner`);
	await client.application.edit({ description: fs.readFileSync("../resource/profile/description.md", "utf8") });
	console.log(`${sub} set description`);
	console.log(`${tag} all ready`);
	client.destroy();
});

client.login(secret.discord.token);