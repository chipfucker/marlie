import * as Discord from "discord.js";
import { rule34 } from "../../../../utility/api/index.js";
import embed from "../../../../utility/embed.js";

export default async (i) => {
	await i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.toJSON().components;
	var page = Number(components[1].components[1].content.replace(/Page (\d+) \/ \d+/, "$1")) - 1;
	components[1] = {
		type: Discord.ComponentType.Container,
		spoiler: !i.channel.nsfw,
		components: embed.inspect.comments.shown(data, ++page)
	};
	await i.editReply({ components: components });
};