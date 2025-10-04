import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import secret from "./secret.json" with { type: "json" };

const client = new Discord.Client({ intents: [ Discord.GatewayIntentBits.Guilds ] });

client.commands = new Discord.Collection();
const foldersPath = path.resolve("command");
const commandFolders = fs.readdirSync(foldersPath);

(async () => { for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => !file.match(/\./));
	for (const parent of commandFiles) {
		const filePath = path.join(commandsPath, parent, "command.js");
		const fileUrl = new URL(`file://${filePath}`).href;
		const command = await import(fileUrl);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}})();

const eventsPath = path.resolve("events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

(async () => { for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const fileUrl = new URL(`file://${filePath}`).href;
	const event = await import(fileUrl);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}})();

client.login(secret.discord.token);
