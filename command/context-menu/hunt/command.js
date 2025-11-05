import { Discord, CT } from "#util/discord.js";
import { Channel } from "#/secret.js";

export const data = {
	name: "🔎 Hunt",
	type: Discord.ApplicationCommandType.Message,
	integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
	contexts: [
		Discord.InteractionContextType.Guild,
		Discord.InteractionContextType.PrivateChannel
	]
};

export async function app(i) {
	const defer = i.deferReply({ flags: [
		Discord.MessageFlags.Ephemeral,
		Discord.MessageFlags.IsComponentsV2,
		Discord.MessageFlags.SuppressNotifications
	]});

	const files = [];

	const attachments = i.targetMessage.attachments.values().map(item => item.url);
	const stickers = i.targetMessage.stickers.values()
		.filter(item => item.format !== Discord.StickerFormatType.Lottie)
		.map(item => item.url);

	files.push(...attachments, ...stickers);

	if (files.length > 10) {
		const response = { components: [
			{ type: CT.TextDisplay,
				content: `Too many images to send! (${files.length} images)`
			}
		]};
		await defer.then(() => i.editReply(response));
		return;
	} else if (files.length < 1) {
		const response = { components: [
			{ type: CT.TextDisplay,
				content: "No images to send."
			}
		]};
		await defer.then(() => i.editReply(response));
		return;
	} else {
		const message = await i.client.channels.fetch(Channel.hunt)
			.then(channel => channel.send({ files }));
	
		const response = { components: [
			{ type: CT.TextDisplay,
				content: `Sent ${files.length} files to ${message.url}!	`
			}
		]};
		await defer.then(() => i.editReply(response))
	}
}
