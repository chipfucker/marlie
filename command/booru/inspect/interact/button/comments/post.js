import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "../../../embed.js";

export default async (i) => {
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");

	const modal = embed.comments.post(id);

	await i.showModal(modal);
};