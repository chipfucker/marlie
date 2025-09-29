import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import terminal from "../utility/terminal.json" with { type: "json" };

export const name = Discord.Events.InteractionCreate;
export async function execute(i) {
	const tag = `${terminal.color.fg.bright.cyan
		+ terminal.font.start.bold}CMD${terminal.font.reset}`;

	console.log(`${tag} ${terminal.color.fg.bright.white}${i.user.username}${terminal.color.fg.default} ran ${terminal.font.start.bold}${(i.commandName || i.message.interaction.commandName)}${terminal.font.reset} ${terminal.font.start.italic
		+ terminal.font.start.faint}(${Discord.ApplicationCommandType[i.commandType || i.message.interaction.type]} ${Discord.InteractionType[i.type]})${terminal.font.reset}`);

	if (i.isChatInputCommand() || i.isMessageContextMenuCommand()) {
		const command = i.client.commands.get(i.commandName);
		try {
			await command.execute(i);
		} catch (error) {
			console.error(error);
			if (i.replied || i.deferred)
				await i.followUp({ content: "### ERROR:\n```\n" + error + "\n```" });

			else
				await i.reply({ content: "### ERROR:\n```\n" + error + "\n```" });
		}
	} else if (i.isAutocomplete()) {
		const command = i.client.commands.get(i.commandName);
		try {
			await command.autocomplete(i);
		} catch (error) {
			console.error(error);
		}
	} else if (i.isButton()) {
		const id = i.customId.replace(/:/g, "/") + ".js";
		const filePath = path.join(__dirname, "button", id);
		const func = await import(filePath);
		await func(i);
	}
}
