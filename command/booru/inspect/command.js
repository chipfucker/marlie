import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "#command/booru/inspect/embed.js";

export const data = {
	name: "inspect",
	description: "Get info of post",
	type: Discord.ApplicationCommandType.ChatInput,
	integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
	contexts: [
		Discord.InteractionContextType.Guild,
		Discord.InteractionContextType.PrivateChannel
	],
	options: [
		{
			name: "q",
			description: "Query for post",
			type: Discord.ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "raw",
			description: "Whether to send as raw file",
			type: Discord.ApplicationCommandOptionType.Boolean
		}
	]
};
export async function execute(i) {
	await i.deferReply();

	var query = i.options.getString("q");
	for (const regex of [
		// Post URL
		/^https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=(\d+)$/,
		// Image URL
		// Digits by themselves
		/^(\d+)$/
	]) if (query.match(regex)) {
		query = query.replace(regex, "id:$1"); break;
	}

	await i.editReply({
		flags: Discord.MessageFlags.IsComponentsV2,
		components: [{
			type: Discord.ComponentType.Container,
			components: [
				{
					type: Discord.ComponentType.TextDisplay,
					content: `# ${query}`
				},
				{
					type: Discord.ComponentType.TextDisplay,
					content: "Loading..." // EMOJI: load
				}
			]
		}]
	});

	if (!query) {
		i.editReply({ components: [{
			type: Discord.ComponentType.Container,
			accent_color: 0xE9263D,
			components: [{
				type: Discord.ComponentType.TextDisplay,
				content: "You must specify a query or applicable URL!"
			}]
		}]});
		return;
	}

	const data = await rule34.post(query);

	if (!data) {
		// TODO: fuzzy search tag for similar tags
		i.editReply({ components: [{
			type: Discord.ComponentType.Container,
			accent_color: 0xE9263D,
			components: [
				{
					type: Discord.ComponentType.TextDisplay,
					content: `No results for \`${query}\`!`
				},
				{
					type: Discord.ComponentType.TextDisplay,
					content: "Perhaps you meant one of these?\n"
						+ `${"(list of similar tags)"}`
				}
			]
		}]});
		return;
	}

	if (i.options.getBoolean("raw")) {
		let content = JSON.stringify(data, null, 4);
		let attachment = {
			attachment: Buffer.from(content),
			name: `${data.id}-info.json`
		};
		i.editReply({ files: [attachment], components: [] });
		return;
	}

	const message = embed.create(query, data);
	message.components[0].spoiler = !i.channel.nsfw;

	await i.editReply(message);
}