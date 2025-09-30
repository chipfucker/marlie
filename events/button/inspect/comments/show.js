import * as Discord from "discord.js";
import { rule34 } from "../../../../utility/api.js";
import embed from "../../../../utility/embed.js";

export default async (i) => {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	components[1] = {
		type: Discord.ComponentType.Container,
		components: [
			{
				type: Discord.ComponentType.TextDisplay,
				content: data.comments.map(comment =>
					`**${comment.creator.name}** >> #${comment.id}\n${comment.content}`
				).join("\n")
			},
			{
				type: Discord.ComponentType.ActionRow,
				components: [
					{
						type: Discord.ComponentType.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Prev",
						custom_id: "inspect:comments:prev"
					},
					{
						type: Discord.ComponentType.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Next",
						custom_id: "inspect:comments:next"
					},
					{
						type: Discord.ComponentType.Button,
						style: Discord.ButtonStyle.Primary,
						label: "Hide comments",
						custom_id: "inspect:comments:hide"
					}
				]
			}
		]
	}
	await i.editReply({ components: components });
};