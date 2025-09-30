import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "#util/embed.js";

export default async (i) => {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	for (let index in components[0].components) {
		const component = components[0].components[index];
		if (component.content?.match(/### General/)) {
			components[0].components[index] = embed.inspect.general.shown(data)[0];
			components[0].components[++index] = embed.inspect.general.shown(data)[1];
			break;
		}
	}
	await i.editReply({ components: components });
};