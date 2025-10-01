import * as Discord from "discord.js";
import * as fs from "node:fs";
import secrets from "../secrets.json" with { type: "json" };

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`\x1b[91m\x1b[1mRFS\x1b[0m setting profile`);
	try { await client.user.setAvatar("../resource/profile/avatar.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setAvatar();
		else throw error;
	}
	client.application.edit()
	console.log("    set avatar");
	try { await client.user.setBanner("../resource/profile/banner.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setBanner();
		else throw error;
	}
	console.log("    set banner");
	await client.application.edit({ description: fs.readFileSync("../resource/profile/description.md", "utf8") });
	console.log("    set description");
	console.log("\x1b[91m\x1b[1mRFS\x1b[0m all ready");
	client.destroy();
});

client.login(secrets.discord.token);