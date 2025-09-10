const {
	ActionRowBuilder,
	ButtonStyle,
	ChannelManager,
	MessageFlags,
	SlashCommandBuilder,
	ForumChannel
} = require("discord.js");
const { post } = require ("../../utility/rule34api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("r")
		.setDescription("Search from Rule34")
		.addStringOption(option =>
			option.setName("q")
				.setDescription("Search query")),
	async execute(interaction) {
		console.log(interaction);
		const query = interaction.options.getString("query");
		interaction.reply({ content: "Creating channel...", flags: MessageFlags.Ephemeral });

		const searchChannel = await interaction.client.channels.fetch("1415155574026403840");
		const saveChannel = await interaction.client.channels.fetch("1340862369345175562");
		const postChannel = await interaction.client.channels.fetch("1295111950656868454");

		const thread = await searchChannel.threads.create({
			name: "Test channel",
			message: {
				content: "it worked!!!"
			},
			appliedTags: ["1415156598929625108"]
		});
		interaction.client.channels.fetch(interaction.channelId).send("Created search thread in <#1415155574026403840>")
		await thread.send("poop");
	}
};
