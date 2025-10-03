import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "../../embed.js";

export async function ButtonInteraction(i, [nav]) {
	await i.deferUpdate();
	const query = i.message.components[0].components[0].content.replace(/## `(.+)` \((?:.+:.+|.+)\)/, "$1");
	const sort = {
		val: i.message.components[0].components[0].content.replace(/## `.+` \((?:(.+):.+|(.+))\)/, "$1$2"),
		dir: i.message.components[0].components[0].content.replace(/## `.+` \((?:.+:(.+)|.+)\)/, "$1"),
		num: i.message.components[0].components[1].content?.replace(/### .+: (.+)/, "$1")
	};
	
	const dataQuery = sort.val === "random"
		? `${query} sort:${sort.val}`
		: (() => {
			const isForward = (nav === "next") === (sort.dir === "desc");
			const com = isForward ? "<" : ">";
			const dir = isForward ? "desc" : "asc";
			return `${query} ${sort.val}:${com}${sort.num} sort:${sort.val}:${dir}`
		})();
	const data = await rule34.post(dataQuery);

	if (!data) { await i.followUp({
		flags: Discord.MessageFlags.Ephemeral + Discord.MessageFlags.IsComponentsV2,
		components: [{ type: Discord.ComponentType.Container, components: [
			{ type: Discord.ComponentType.TextDisplay, content: "No more results this way!" }
		]}]
	}); return; }

	const message = embed.create(data, query, sort);
	await i.editReply(message);
}