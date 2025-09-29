import * as Discord from "discord.js";
import * as fs from "node:fs";

export const data = new Discord.ContextMenuCommandBuilder()
	.setName("hey man")
	.setType(3)
	.setIntegrationTypes(1).setContexts(0, 2);
export async function execute(i) {
	const message = JSON.parse(fs.readFileSync("commands/fun/heyman.json", "utf8"));
	await i.reply(message);
}