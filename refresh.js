import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import secrets from "./secrets.json" with { type: "json" };

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) (async () => {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
})();

const rest = new Discord.REST().setToken(secrets.config.token);

(async () => {
	console.log("\x1b[91m\x1b[1mRFS\x1b[0m deleting commands")
	await rest.put(Discord.Routes.applicationCommands(secrets.config.clientId), { body: [] })
		.then(() => console.log("  deleted application commands"))
		.catch(console.error);
	await rest.put(Discord.Routes.applicationGuildCommands(secrets.config.clientId, secrets.config.guildId), { body: [] })
		.then(() => console.log("  deleted guild commands"))
		.catch(console.error);
	console.log(`\x1b[91m\x1b[1mRFS\x1b[0m refreshing ${commands.length} commands`);
	await wait(500).then(() => console.log("  .5 seconds elapsed")).catch(console.error);
	await rest.put(Discord.Routes.applicationCommands(secrets.config.clientId), { body: commands })
		.then(e => console.log(`  refreshed ${e.length} commands`))
		.catch(console.error);
	await client.login(secrets.config.token);
})();
	
client.once("clientReady", async (client) => {
	console.log(`\x1b[91m\x1b[1mRFS\x1b[0m setting profile...`);
	try { await client.user.setAvatar("profile/avatar.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setAvatar();
		else throw error;
	}
	client.application.edit()
	console.log("  set avatar");
	try { await client.user.setBanner("profile/banner.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setBanner();
		else throw error;
	}
	console.log("  set banner");
	await client.application.edit({ description: fs.readFileSync("profile/description.md", "utf8") });
	console.log("  set description");
	console.log("\x1b[91m\x1b[1mRFS\x1b[0m set profile");
	client.destroy();
});