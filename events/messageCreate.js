import { Discord } from "#util/discord.js";
import * as log from "#util/log.js";

export const name = Discord.Events.MessageCreate;
export async function execute(m) {
	try {
		const abbr = m.content.match(/^\$(\S+)/)[1];
		if (!abbr) return;

		const arguments = m.content.match(/^\$\S+\s*(.*)/)[1];

		const command = m.client.commands.get(m.client.commands.abbr.get(abbr))
			?? m.client.commands.get(abbr);
		if (!command) return;

		await command.message(arguments);
	} catch (error) {
		await m.author.send(log.throwError(error));
	}
}