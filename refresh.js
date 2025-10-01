import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
const __dirname = import.meta.dirname;
import secrets from "./secrets.json" with { type: "json" };

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

const tag = "\x1b[1;91mRFS\x1b[m";
const subtag = "   ";

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

(async () => {
	console.log(`${tag} getting items from command folder`);
	for (const folder of commandFolders) {
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
				console.log(`${subtag} WARN: ${filePath} has no "data" or no "execute" property`);
			}
		}
	}
})();

const rest = new Discord.REST().setToken(secrets.discord.token);

(async () => {
	console.log(`${tag} deleting commands`);
	await rest.put(Discord.Routes.applicationCommands(secrets.discord.clientId), { body: [] })
		.then(() => console.log(`${subtag} deleted application commands`))
		.catch(console.error);
	await rest.put(Discord.Routes.applicationGuildCommands(secrets.discord.clientId, secrets.discord.guildId), { body: [] })
		.then(() => console.log(`${subtag} deleted guild commands`))
		.catch(console.error);
	console.log(`${tag} refreshing ${commands.length} commands`);
	await rest.put(Discord.Routes.applicationCommands(secrets.discord.clientId), { body: commands })
		.then(e => console.log(`${subtag} refreshed ${e.length} commands`))
		.catch(console.error);
	await client.login(secrets.discord.token);
})();
	
client.once(Discord.Events.ClientReady, async (client) => {
	console.log(`${tag} setting profile`);
	try { await client.user.setAvatar("profile/avatar.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setAvatar();
		else throw error;
	}
	client.application.edit()
	console.log(`${subtag} set avatar`);
	try { await client.user.setBanner("profile/banner.png"); }
	catch (error) {
		if (error.code === "ENOENT") await client.user.setBanner();
		else throw error;
	}
	console.log(`${subtag} set banner`);
	await client.application.edit({ description: fs.readFileSync("profile/description.md", "utf8") });
	console.log(`${subtag} set description`);
	console.log(`${tag} all ready`);
	client.destroy();
});