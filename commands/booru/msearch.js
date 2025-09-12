const {
	ActionRowBuilder,
	ButtonStyle,
	ChannelManager,
	MessageFlags,
	SlashCommandBuilder,
	ForumChannel
} = require("discord.js");
const { post } = require("../../utility/rule34api.js");
const { searchEmbed } = require("../../utility/embed.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("msearch")
		.setDescription("Search from Rule34")
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
				{ name: "ID Descending", value: '{"val":"id","dir":"desc"}' }
			)),
	async execute(interaction) {
		const query = interaction.options.getString("q");
		const sort = JSON.parse(interaction.options.getString("sort") || '{"val":"id","dir":"desc"}');
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
			general: interaction.options.getString("general") ?? false,
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
