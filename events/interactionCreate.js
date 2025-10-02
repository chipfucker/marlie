import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
const __dirname = import.meta.dirname;
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.interaction;

export const name = Discord.Events.InteractionCreate;
export async function execute(i) {
	console.log(`${tag} \x1b[1m${
		i.user.username
	}\x1b[m ran \x1b[1m${
		(i.commandName || i.message.interaction.commandName)
	}\x1b[m \x1b[2;3m(${
		i.constructor.name
	})\x1b[m`);
	
	switch (true) {
		case i.isChatInputCommand():
		case i.isMessageContextMenuCommand(): {
			const command = i.client.commands.get(i.commandName);
			try {
				await command.execute(i);
			} catch (error) {
				console.error(error);
				const message = { content: "### ERROR:\n```\n" + error + "\n```" };
				if (i.replied || i.deferred) await i.followUp(message);
				else await i.reply(message);
			}
		} break;

		case i.isAutocomplete(): {
			const command = i.client.commands.get(i.commandName);
			try {
				await command.autocomplete(i);
			} catch (error) {
				console.error(error);
			}
		} break;

		case i.isButton():
		case i.isModalSubmit(): {
			// custom id format: directory:file?params
			// split custom id into dir and rest
			const [dir, rest] = i.customId.split(/\:/);
			// split rest into file and params
			const restArr = rest.split(/\?/);
			// assign filename to file
			const file = restArr[0] + ".js";
			// split params string if it exists, else return undefined
			const params = restArr[1]?.split(";");
	
			// create path
			const filePath = path.join(__dirname, "../command", dir, "interact", file);
			const url = new URL(`file://${filePath}`).href;
	
			// import and execute file
			const func = await import(url);
			await func[i.constructor.name](i, params);
		} break;

		default: throw new Error(`This interaction type (${i.constructor.name})is not supported yet.`);
	}
}
