import * as Discord from "discord.js";
import * as fs from "node:fs";
import { posix as path } from "node:path";
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.refresh;
import secret from "../secret.json" with { type: "json" };

const commands = [];
const foldersPath = path.resolve("commands");
const commandFolders = fs.readdirSync(foldersPath);

(async () => { for (const folder of commandFolders) {
	if (folder === "button") continue;
	const commandsPath = path.jkoin(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const fileUrl = new URL(`file://${filePath}`).href;
		const command = await import(fileUrl);
		if ("data" in command && "execute" in command) {
			const json = command.data.toJSON ? command.data.toJSON() : command.data;
			commands.push(json);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}})();

const rest = new Discord.REST().setToken(secret.discord.token);

(async () => {
	console.log(`${tag} deleting commands`);
	await rest.put(Discord.Routes.applicationCommands(secret.discord.clientId), { body: [] })
		.then(() => console.log(`${sub} deleted application commands`))
		.catch(console.error);
	await rest.put(Discord.Routes.applicationGuildCommands(secret.discord.clientId, secret.discord.guildId), { body: [] })
		.then(() => console.log(`${sub} deleted guild commands`))
		.catch(console.error);
	console.log(`${tag} adding ${commands.length} commands`);
	await rest.put(Discord.Routes.applicationCommands(secret.discord.clientId), { body: commands })
		.then(e => console.log(`${sub} added ${e.length} commands`))
		.catch(console.error);
})();