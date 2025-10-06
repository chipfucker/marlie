import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import secret from "#root/secret.json" with { type: "json" };

export async function ButtonInteraction(i, [stock, id]) {
	await i.deferReply({ flags: Discord.MessageFlags.Ephemeral });
	stock = {
		save: secret.channel.save.id,
		pack: secret.channel.pack.id
	}[stock];
};