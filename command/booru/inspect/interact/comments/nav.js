import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "../../embed.js";

export async function ButtonInteraction(i, [param]) {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	var page = Number(components[1].components[1].content.replace(/Page (\d+) \/ \d+/, "$1")) - 1;
	if (param === "prev") page--;
	else if (param === "next") page++;
	components[1] = embed.comments.shown(data, page);
	components[1].spoiler = !i.channel.nsfw;
	await i.editReply({ components: components });
};