import * as Discord from "discord.js";

export const data = new Discord.ContextMenuCommandBuilder()
	.setName("Send to #image-search")
	.setType(3)
	.setIntegrationTypes(1).setContexts(0, 2);
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