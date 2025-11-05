import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import secret from "./secret.json" with { type: "json" };

const client = new Discord.Client({ intents: [
	Discord.GatewayIntentBits.Guilds,
	Discord.GatewayIntentBits.MessageContent
]});

client.commands = new Discord.Collection();
client.commands.abbr = new Discord.Collection();

const foldersPath = path.resolve("command");
const commandFiles = fs.readdirSync(foldersPath, { recursive: true })
	.filter(file => file.match(/command\.js$/));

(async () => {
	for (const commandDir of commandFiles) {
		const commandPath = path.join(foldersPath, commandDir);
		const fileUrl = new URL(`file://${commandPath}`);
		const command = await import(fileUrl);

		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
			client.commands.abbr.set(command.data.abbr, command);
		} else {
			console.warn(`Command doesn't have data or execute export:\n${fileUrl}`);
		}
	}
})();

const eventsPath = path.resolve("events");
const eventFiles = fs.readdirSync(eventsPath)
	.filter(file => file.match(/\.js$/));

(async () => { for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const fileUrl = new URL(`file://${filePath}`).href;
	const event = await import(fileUrl);
	if (event.once) {
		client.once(event.name, event.execute);
	} else {
		client.on(event.name, event.execute);
	}
}})();

client.login(secret.discord.token);
