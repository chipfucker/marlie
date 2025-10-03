import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "../../embed.js";

export async function ButtonInteraction(i, [direction, isRandom]) {
	await i.deferUpdate();
	isRandom = Number(isRandom);
	const query = i.message.components[0].components[0].content.replace(/## `(.+)` \(.+:.+\)/, "$1");
	const sort = {
		val: i.message.components[0].components[0].content.replace(/## `.+` \((.+):.+\)/, "$1"),
		dir: i.message.components[0].components[0].content.replace(/## `.+` \(.+:(.+)\)/, "$1")
	};
	const value = i.message.components[0].components[1].content?.replace(/### .+: (.+)/, "$1");
}