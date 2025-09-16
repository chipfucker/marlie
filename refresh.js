const { REST, Routes } = require("discord.js");
const { config } = require("../config.json");
const fs = require("node:fs");
const path = require("node:path");
const wait = require("node:timers/promises").setTimeout;

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(config.token);

(async () => {
	console.log("DELETING ALL COMMANDS")
	console.log("    deleting application commands...");
	await rest.put(Routes.applicationCommands(config.clientId), { body: [] })
		.then(() => console.log("        deleted application commands"))
		.catch(console.error);
	console.log("    deleting guild commands...");
	await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] })
		.then(() => console.log("        deleted guild commands"))
		.catch(console.error);
	
	console.log(`REFRESHING ${commands.length} COMMANDS`);
	console.log("    waiting .5 seconds...");
	await wait(500).then(() => console.log("        .5 seconds elapsed")).catch(console.error);
	console.log("    refreshing commands...");
	await rest.put(Routes.applicationCommands(config.clientId), { body: commands })
		.then(e => console.log(`        refreshed ${e.length} commands`))
		.catch(console.error);
})();
