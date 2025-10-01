import * as Discord from "discord.js";
import * as fs from "node:fs";
import secrets from "../secrets.json" with { type: "json" };

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

const tag = "\x1b[1;91mRFS\x1b[m";
const subtag = "   ";
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`${tag} setting profile`);
	try { await client.user.setAvatar("../resource/profile/avatar.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setAvatar();
		else throw error;
	}
	client.application.edit()
	console.log(`${subtag} set avatar`);
	try { await client.user.setBanner("../resource/profile/banner.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setBanner();
		else throw error;
	}
	console.log(`${subtag} set banner`);
	await client.application.edit({ description: fs.readFileSync("../resource/profile/description.md", "utf8") });
	console.log(`${subtag} set description`);
	console.log(`${tag} all ready`);
	client.destroy();
});

client.login(secrets.discord.token);