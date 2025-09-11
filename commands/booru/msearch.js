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
			.setDescription("Whether to show general tags")),
	async execute(interaction) {
		const query = interaction.options.getString("q");
		await interaction.reply({ embeds: [{
			title: query,
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

		const messageData = {
			query: query,
			id: data.info.file.id,
			general: interaction.options.getString("general") ?? false
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
