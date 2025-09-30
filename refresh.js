import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
const __dirname = import.meta.dirname;
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
		const fileUrl = new URL(`file://${filePath}`).href;
		const command = await import(fileUrl);
		if ("data" in command && "execute" in command) {
			const json = command.data.toJSON();
			console.debug(json);
			commands.push(json);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
})();

const rest = new Discord.REST().setToken(secrets.discord.token);

(async () => {
	console.log("\x1b[91m\x1b[1mRFS\x1b[0m deleting commands")
	await rest.put(Discord.Routes.applicationCommands(secrets.discord.clientId), { body: [] })
		.then(() => console.log("  deleted application commands"))
		.catch(console.error);
	await rest.put(Discord.Routes.applicationGuildCommands(secrets.discord.clientId, secrets.discord.guildId), { body: [] })
		.then(() => console.log("  deleted guild commands"))
		.catch(console.error);
	console.log(`\x1b[91m\x1b[1mRFS\x1b[0m refreshing ${commands.length} commands`);
	await wait(500).then(() => console.log("  .5 seconds elapsed")).catch(console.error);
	await rest.put(Discord.Routes.applicationCommands(secrets.discord.clientId), { body: commands })
		.then(e => console.log(`  refreshed ${e.length} commands`))
		.catch(console.error);
	await client.login(secrets.discord.token);
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