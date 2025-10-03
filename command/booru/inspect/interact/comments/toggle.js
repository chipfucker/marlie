import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "../../embed.js";

export async function ButtonInteraction(i, [param]) {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	if (param === "show") {
		components[1] = embed.comments.shown(data, 0);
		components[1].spoiler = !i.channel.nsfw;
	} else if (param === "hide")
		components[1] = embed.comments.hidden(data);
	await i.editReply({ components: components });
};