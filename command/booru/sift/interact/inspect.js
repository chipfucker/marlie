import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "#command/booru/inspect/embed.js";

export async function ButtonInteraction(i, id) {
	await i.deferUpdate();
	const data = await rule34.post("id:" + id);
	const message = embed.create(`Inspecting ${id}`, data);
	message.components[0].spoiler = !i.channel.nsfw;
	await i.followUp(message);
};