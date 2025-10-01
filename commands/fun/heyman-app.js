import * as Discord from "discord.js";
import * as fs from "node:fs";

export const data = {
	name: "heyman",
	description: "hey man",
	type: Discord.ApplicationCommandType.ChatInput,
	integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
	contexts: [
		Discord.InteractionContextType.Guild,
		Discord.InteractionContextType.PrivateChannel
	]
};
export async function execute(i) {
	const message = JSON.parse(fs.readFileSync("commands/fun/heyman.json", "utf8"));
	await i.reply(message);
}