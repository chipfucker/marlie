import * as Discord from "discord.js";
import { rule34 } from "../../../../utility/api";
import embed from "../../../../utility/embed.js";

export default async (i) => {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const components = i.message.toJSON().components;
	for (const index in components[0].components) {
		const component = components[0].components[index];
		if (component.content?.match(/### General/)) {
			components[0].components[index] = {
				type: Discord.ComponentType.TextDisplay,
				content: "### General"
			};
			components[0].components[String(Number(index) + 1)].components[0] = {
				type: Discord.ComponentType.Button,
				style: Discord.ButtonStyle.Secondary,
				label: `${component.content.substring(12).split("\n").length} tags`,
				custom_id: "inspect:general:show"
			};
			break;
		}
	}
	await i.editReply({ components: components });
};