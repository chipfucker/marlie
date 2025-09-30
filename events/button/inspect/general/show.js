import * as Discord from "discord.js";
import { rule34 } from "#/utility/api.js";
import * as embed from "#/utility/embed.js";

export default async (i) => {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	for (let index in components[0].components) {
		const component = components[0].components[index];
		if (component.content?.match(/### General/)) {
			components[0].components[index] = {
				type: Discord.ComponentType.TextDisplay,
				content: embed.inspect.general(data)
			};
			components[0].components[++index].components[0] = {
				type: Discord.ComponentType.Button,
				style: Discord.ButtonStyle.Secondary,
				label: "Hide tags",
				custom_id: "inspect:general:hide"
			};
			break;
		}
	}
	await i.editReply({ components: components });
};