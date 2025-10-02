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
			Discord.ApplicationCommandType[i.commandType || i.message.interaction.type]
		} ${
			Discord.InteractionType[i.type]
		})\x1b[m`);

	if (i.isChatInputCommand() || i.isMessageContextMenuCommand()) {
		const command = i.client.commands.get(i.commandName);
		try {
			await command.execute(i);
		} catch (error) {
			console.error(error);
			if (i.replied || i.deferred)
				await i.followUp({ content: "### ERROR:\n```\n" + error + "\n```" });
			else await i.reply({ content: "### ERROR:\n```\n" + error + "\n```" });
		}
	} else if (i.isAutocomplete()) {
		const command = i.client.commands.get(i.commandName);
		try {
			await command.autocomplete(i);
		} catch (error) {
			console.error(error);
		}
	} else if (i.isButton()) {
		const id = i.customId.split(":");
		const parent = id.shift();
		const file = id.pop() + ".js";

		const filePath = path.join(__dirname, "../command", parent, "interact/button", file);
		const fileUrl = new URL(`file://${filePath}`).href;

		const func = await import(fileUrl);
		await func.default(i);
	} else if (i.isModalSubmit()) {
		const id = i.customId.split(":");
		const parent = id.shift();
		const file = id.pop() + ".js";

		const filePath = path.join(__dirname, "../command", parent, "interact/modal", file);
		const fileUrl = new URL(`file://${filePath}`).href;

		const func = await import(fileUrl);
		await func.default(i);
	}
}
