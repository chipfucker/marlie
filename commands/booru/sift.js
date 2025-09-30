import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";
import embed from "#util/embed.js";

export const data = new Discord.SlashCommandBuilder()
	.setName("sift")
	.setDescription("Search from Rule34")
	.setIntegrationTypes(1).setContexts(0, 2)
	.addStringOption(option => option
		.setName("q")
		.setDescription("Search query")
		.setRequired(true)
		.setAutocomplete(true))
	.addBooleanOption(option => option
		.setName("general")
		.setDescription("Whether to show general tags"))
	.addStringOption(option => option
		.setName("sort")
		.setDescription("What to sort by")
		.setChoices(
			{ name: "Image width", value: "width" },
			{ name: "Image height", value: "height" },
			{ name: "ID", value: "id" },
			{ name: "Score", value: "score" },
			{ name: "Random", value: "random" }
		))
	.addStringOption(option => option
		.setName("dir")
		.setDescription("What direction to sort in")
		.setChoices(
			{ name: "Descending", value: "desc" },
			{ name: "Ascending", value: "asc" }
		))
	.addStringOption(option => option
		.setName("autocomplete")
		.setDescription("View autocomplete results for tag")
		.setAutocomplete(true));
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
				color: 0xE9263d
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
