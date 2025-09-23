const Discord = require("discord.js");
const { autocomplete, post } = require("../../utility/rule34api.js");
const { searchEmbed } = require("../../utility/embed.js");

module.exports = {
	data: new Discord.SlashCommandBuilder()
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
			.setAutocomplete(true)),
	async autocomplete(interaction) {
		const focused = interaction.options.getFocused(true);
		const data = await autocomplete(focused.value);
		if (!data) {
			await interaction.respond([{ name: ">> Get typin', nerd.", value: "" }]);
			return;
		}
		if (focused.name === "q") {
			if (!data.length) {
				await interaction.respond([{
					name: `>> No tags that begin with "${focused.value.split(" ").pop()}"!`,
					value: focused.value
				}]);
				return;
			}
			await interaction.respond(
				data.map(obj => ({ name: obj.query, value: obj.query }))
			);
		}
		if (focused.name === "autocomplete") {
			if (!data.length) {
				await interaction.respond([{ name: ">> NONE", value: "" }]);
				return;
			}
			await interaction.respond(
				data.map(obj => ({ name: `${obj.tag}  (${obj.count})`, value: "" }))
			);
		}
	},
	async execute(interaction) {
		const input = interaction.options.getString("q");
		const sort = {
			val: interaction.options.getString("sort") || "id",
			dir: interaction.options.getString("dir") || "desc"
		};

		await interaction.reply({ embeds: [{
			title: `\`${input}\` (${sort.val}:${sort.dir})`,
			description: "Loading..."
		}]});
		
		const query = `${input} sort:${sort.val}:${sort.dir}`;
		const data = await post(query);
		if (!data) {
			await interaction.editReply({ embeds: [{
				title: `No results for \`${query}\`!`,
				color: 0xe9263d
			}]});
			return;
		}

		const messageData = {
			query: input,
			sort: sort,
			value: (() => { switch (sort.val) {
				case "width": return data.image.size.original.width;
				case "height": return data.image.size.original.height;
				case "id": return data.info.file.id;
				case "score": return data.info.post.score;
				default: return 0;
			}})(),
			general: interaction.options.getBoolean("general") ?? false,
		};

		const message = searchEmbed(messageData.query, data, messageData.general);

		await interaction.editReply({
			content: `||\`\`\`json\n${JSON.stringify(messageData)}\n\`\`\`||`,
			embeds: [message.embed],
			components: [message.buttons],
			withResponse: true
		});
	},
};
