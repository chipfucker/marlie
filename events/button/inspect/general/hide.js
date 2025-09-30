import * as Discord from "discord.js";
import { rule34 } from "../../../../utility/api";
import embed from "../../../../utility/embed.js";

export default async (i) => {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	for (const index in components[0].components) {
		const component = components[0].components[index];
		if (component.content?.match(/### General/)) {
			components[0].components[index] = embed.inspect.general.hidden(data)[0];
			components[0].components[++index] = embed.inspect.general.hidden(data)[1];
			break;
		}
	}
	await i.editReply({ components: components });
};