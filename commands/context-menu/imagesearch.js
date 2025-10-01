import * as Discord from "discord.js";

export const data = {
	name: "Send to #hunts",
	type: Discord.ApplicationCommandType.Message,
	integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
	contexts: [
		Discord.InteractionContextType.Guild,
		Discord.InteractionContextType.PrivateChannel
	]
};
export async function execute(i) {
	await i.deferReply({ flags: 64 });

	const target = i.targetMessage;

	const message = {
		content: target.content,
		files: [],
		flags: 4
	};

	for (const [key, value] of target.attachments)
		message.files.push({ attachment: value.url });

	if (message.files.length < (10 - target.embeds.length)) for (const embed of target.embeds) {
	}

	const channel = await i.client.channels.fetch("1295111688881836203");
	const response = await channel.send(message);
	await i.editReply(`Message sent to ${response.channel.url}!\n${""}Jump back: ${i.targetMessage.url}`);
}