import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import { sift as embed } from "#command/booru/sift/embed.js";

export const data = {
	name: "sift",
	description: "Search from Rule34",
	type: Discord.ApplicationCommandType.ChatInput,
	integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
	contexts: [
		Discord.InteractionContextType.Guild,
		Discord.InteractionContextType.PrivateChannel
	],
	options: [
		{
			name: "q",
			description: "Search query",
			type: Discord.ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "sort",
			description: "What to sort by",
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: "ID", value: "id" },
				{ name: "Score", value: "score" },
				{ name: "Image width", value: "width" },
				{ name: "Image height", value: "height" },
				{ name: "Random", value: "random" }
			]
		},
		{
			name: "dir",
			description: "What direction to sort in",
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: "Descending", value: "desc" },
				{ name: "Ascending", value: "asc" }
			]
		},
		{
			name: "autocomplete",
			description: "View autocomplete results for tag",
			type: Discord.ApplicationCommandOptionType.String,
			required: false,
			autocomplete: true
		}
	]
};
export async function autocomplete(i) {
	const focused = i.options.getFocused(true);
	const data = await rule34.autocomplete(focused.value);
	if (!data) {
		await i.respond([{ name: ">> Get typin', nerd.", value: "" }]);
		return;
	}
	if (focused.name === "autocomplete") {
		if (!data.length) await i.respond([{ name: ">> NONE", value: "" }]);
		else await i.respond(
			data.map(obj => ({ name: `${obj.tag}  (${obj.count})`, value: "" }))
		);
	}
};
export async function execute(i) {
	const query = i.options.getString("q");
	const sort = {
		val: i.options.getString("sort") || "id",
		dir: i.options.getString("dir") || "desc"
	};

	await i.reply({
		flags: Discord.MessageFlags.IsComponentsV2,
		components: [{ type: Discord.ComponentType.Container, components: [
			{ type: Discord.ComponentType.TextDisplay,
				content: `## \`${query}\` (${sort.val}:${sort.dir})`
			},
			{ type: Discord.ComponentType.TextDisplay,
				content: "Loading..."
			}
		]}]
	});

	const resultQuery = `${query} sort:${sort.val}:${sort.dir}`;
	const data = await rule34.post(resultQuery);
	if (!data) {
		await i.editReply({ components: [{
			type: Discord.ComponentType.Container,
			accent_color: 0xE9263D,
			components: [{ type: Discord.ComponentType.TextDisplay,
				content: `### No results for \`${resultQuery}\`!`
			}]
		}]});
		return;
	}

	const message = embed.create(data, query, sort);
	message.components[0].spoiler = !i.channel.nsfw;

	await i.editReply(message);
};
