import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import secret from "#root/secret.json" with { type: "json" };

export async function ButtonInteraction(i, [stash, id]) {
	await i.deferUpdate();
	stash = secret.discord.channel[stash].id;
	await i.followUp({
		flags: Discord.MessageFlags.Ephemeral,
		content: `Sending to <#${stash}>...`
	});
	const channel = await i.client.channels.fetch(stash);
	const message = await channel.send({ content: `https://rule34.xxx/index.php?page=post&s=view&id=${id}` });
	await i.editReply({ content: `Sent to <#${stash}>!\n${message.url}` });
};