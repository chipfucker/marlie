import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.throw;

export const data = {
	name: "Throw to basket",
	type: Discord.ApplicationCommandType.Message,
	integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
	contexts: [
		Discord.InteractionContextType.Guild,
		Discord.InteractionContextType.PrivateChannel
	]
};
export async function execute(i) {
	if (i.channelId === "1384093405017018399") await i.deferReply();
	else await i.deferReply({ flags: 64 });

	console.log(`${tag} \x1b[2mcatching message as \x1b[m"${i.id}"`);

	const catchPath = path.join("./basket");
	if (!fs.existsSync(catchPath)) fs.mkdirSync(catchPath);

	const file = path.join(catchPath, i.id + ".json");

	fs.writeFileSync(file, JSON.stringify(i.targetMessage, null, "\t"));

	console.log(`${sub} MESSAGE CAUGHT: ${file}`);
	if (i.channelId === "1384093405017018399") {
		await i.editReply(`Message thrown!\n\`${file}\``);
	}
	else {
		const channel = await i.client.channels.fetch("1384093405017018399");
		const response = await channel.send(`Message thrown from <#${i.channelId}>!\n\`${file}\``);
		await i.editReply(`Message thrown! https://discord.com/channels/1294885290275770430/1384093405017018399/${response.id}`);
	}
}