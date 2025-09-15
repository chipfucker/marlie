const {
	ChannelManager,
	MessageFlags,
	SlashCommandBuilder
} = require("discord.js");
const { post } = require("../../utility/rule34api.js");
const { searchEmbed } = require("../../utility/embed.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("msearch")
		.setDescription("Search from Rule34")
		.setIntegrationTypes(1).setContexts(0, 2)
		.addStringOption(option => option
			.setName("q")
			.setDescription("Search query")
			.setRequired(true))
		.addBooleanOption(option => option
			.setName("general")
			.setDescription("Whether to show general tags"))
		.addStringOption(option => option
			.setName("sort")
			.setDescription("What direction to sort in")
			.setChoices(
				{ name: "width:desc", value: '{"val":"width","dir":"desc"}'},
				{ name: "width:asc", value: '{"val":"width","dir":"asc"}'},
				{ name: "height:desc", value: '{"val":"height","dir":"desc"}'},
				{ name: "height:asc", value: '{"val":"height","dir":"asc"}'},
				{ name: "id:desc", value: '{"val":"id","dir":"desc"}' },
				{ name: "id:asc", value: '{"val":"id","dir":"asc"' },
				{ name: "parent:desc", value: '{"val":"parent","dir":"desc"}'},
				{ name: "parent:asc", value: '{"val":"parent","dir":"asc"}'},
				{ name: "score:desc", value: '{"val":"score","dir":"desc"}'},
				{ name: "score:asc", value: '{"val":"score","dir":"asc"}'},
				{ name: "source:desc", value: '{"val":"source","dir":"desc"}'},
				{ name: "source:asc", value: '{"val":"source","dir":"asc"}'},
				{ name: "updated:desc", value: '{"val":"updated","dir":"desc"}'},
				{ name: "updated:asc", value: '{"val":"updated","dir":"asc"}'},
			)),
	async execute(interaction) {
		const query = interaction.options.getString("q");
		const sort = JSON.parse(interaction.options.getString("sort")
			|| '{"val":"id","dir":"desc"}');
		await interaction.reply({ embeds: [{
			title: `${query} (sort\:${sort.val}\:${sort.dir})`,
			description: "Loading..."
		}]});

		const data = await post(query);
		if (!data) {
			await interaction.editReply({ embeds: [{
				title: `No results for \`${query}\`!`,
				color: 0xe9263d
			}]});
			return;
		}

		// use new 'value' object from api
		const messageData = {
			query: query,
			sort: sort,
			id: data.info.file.id,
			general: interaction.options.getBoolean("general") ?? false,
		};

		const message = searchEmbed(messageData.query, data, messageData.general);

		interaction.editReply({
			content: `||\`\`\`json\n${JSON.stringify(messageData)}\n\`\`\`||`,
			embeds: [message.embed],
			components: [message.buttons],
			withResponse: true
		});
	}
};
