import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "#util/embed.js";

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
			name: "general",
			description: "Whether to show general tags",
			type: Discord.ApplicationCommandOptionType.Boolean
		},
		{
			name: "sort",
			description: "What to sort by",
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: "Image width", value: "width" },
				{ name: "Image height", value: "height" },
				{ name: "ID", value: "id" },
				{ name: "Score", value: "score" },
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
	if (focused.name === "q") {
		if (!data.length) {
			await i.respond([{
				name: `>> No tags that begin with "${focused.value.split(" ").pop()}"!`,
				value: focused.value
			}]);
			return;
		}
		await i.respond(
			data.map(obj => ({ name: obj.query, value: obj.query }))
		);
	}
	if (focused.name === "autocomplete") {
		if (!data.length) {
			await i.respond([{ name: ">> NONE", value: "" }]);
			return;
		}
		await i.respond(
			data.map(obj => ({ name: `${obj.tag}  (${obj.count})`, value: "" }))
		);
	}
}
export async function execute(i) {
	const input = i.options.getString("q");
	const sort = {
		val: i.options.getString("sort") || "id",
		dir: i.options.getString("dir") || "desc"
	};

	await i.reply({
		embeds: [{
			title: `\`${input}\` (${sort.val}:${sort.dir})`,
			description: "Loading..."
		}]
	});

	const query = `${input} sort:${sort.val}:${sort.dir}`;
	const data = await rule34.post(query);
	if (!data) {
		await i.editReply({
			embeds: [{
				title: `No results for \`${query}\`!`,
				color: 0xE9263D
			}]
		});
		return;
	}

	const messageData = {
		query: input,
		sort: sort,
		value: (() => {
			switch (sort.val) {
				case "width": return data.image.main.width;
				case "height": return data.image.main.height;
				case "id": return data.id;
				case "score": return data.score;
				default: return 0;
			}
		})(),
		general: i.options.getBoolean("general") ?? false,
	};

	const message = embed.searchEmbed(messageData.query, data, messageData.general);

	await i.editReply({
		content: `||\`\`\`json\n${JSON.stringify(messageData)}\n\`\`\`||`,
		embeds: [message.embed],
		components: [message.buttons],
		withResponse: true
	});
}
