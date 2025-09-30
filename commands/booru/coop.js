import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";

export const data = new Discord.SlashCommandBuilder()
	.setName("coop")
	.setDescription("Goon with a pal")
	.setIntegrationTypes(1).setContexts(0, 2)
	.addStringOption(option => option
		.setName("q")
		.setDescription("Search query")
		.setRequired(true)
		.setAutocomplete(true))
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

	await i.reply({ content: `# ${input}\nLoading...` });

	const query = `${input} sort:${sort.val}:${sort.dir}`;
	const data = await rule34.post(query);
	if (!data) {
		await i.editReply({ content: `No results for \`${query}\`!` });
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
		})()
	};

	await i.editReply({
		content: `-# [Data URL](https://data?${JSON.stringify(messageData)} "Ignore this!")\n`
			+ `:mag_right: ${input}\n[Image](${data.image.main.url}?${data.id})`,

		components: [{
			type: 1,
			components: [
				{
					type: 2,
					style: 2,
					label: "Prev",
					custom_id: "showoff:prev"
				},
				{
					type: 2,
					style: 2,
					label: "Next",
					custom_id: "showoff:next"
				}
			]
		}],
		withResponse: true
	});
}
