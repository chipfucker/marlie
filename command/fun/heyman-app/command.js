import * as Discord from "discord.js";
import * as fs from "node:fs";
import { posix as path } from "node:path";

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
	const message = eval(fs.readFileSync(path.resolve("resource/live/heyman.js"), "utf8"));
	await i.reply(message);
}