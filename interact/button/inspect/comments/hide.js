import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "#util/embed.js";

export default async (i) => {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	components[1] = embed.comments.hidden(data);
	await i.editReply({ components: components });
};