import { Discord, CT } from "#util/discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as log from "#util/log.js";
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.interaction;

export const name = Discord.Events.InteractionCreate;
export async function execute(i) {
	console.log(`${tag} ${
		i.user.username
	} used \x1b[1m${
		(i.commandName || i.message.interaction.commandName)
	}\x1b[m \x1b[2;3m(${
		i.constructor.name
	})\x1b[m`);

	try { switch (true) {
		case i.isChatInputCommand():
		case i.isMessageContextMenuCommand(): {
			const command = i.client.commands.get(i.commandName);
			await command.app(i);
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
			const [_, id, param, args] = i.customId.match(/(.+?):([^\?]+)\??(.*)/);
			const command = i.client.commands.get(id);
			await command[param][i.constructor.name](i, args);
		} break;

		default: throw new Error(`This interaction type (${i.constructor.name}) is not supported yet.`);
	}} catch (error) {
		await i.user.send(log.throwError(error));
	}
}
