import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
const __dirname = import.meta.dirname;
import secrets from "../secrets.json" with { type: "json" };

const tag = "\x1b[1;91mRFS\x1b[m";
const subtag = "   ";

const commands = [];
const foldersPath = path.join(__dirname, "/../commands");
const commandFolders = fs.readdirSync(foldersPath);

(async () => { for (const folder of commandFolders) {
	if (folder === "button") continue;
	const commandsPath = path.join(foldersPath, folder);
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

const rest = new Discord.REST().setToken(secrets.discord.token);

(async () => {
	console.log(`${tag} deleting commands`);
	await rest.put(Discord.Routes.applicationCommands(secrets.discord.clientId), { body: [] })
		.then(() => console.log(`${subtag} deleted application commands`))
		.catch(console.error);
	await rest.put(Discord.Routes.applicationGuildCommands(secrets.discord.clientId, secrets.discord.guildId), { body: [] })
		.then(() => console.log(`${subtag} deleted guild commands`))
		.catch(console.error);
	console.log(`${tag} adding ${commands.length} commands`);
	await rest.put(Discord.Routes.applicationCommands(secrets.discord.clientId), { body: commands })
		.then(e => console.log(`${subtag} added ${e.length} commands`))
		.catch(console.error);
})();