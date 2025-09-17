const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("throw")
		.setDescription("Throw a message to the codespace!")
		.setIntegrationTypes(1).setContexts(0, 2)
		.addStringOption(option => option
			.setName("text")
			.setDescription("Text to throw")
			.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const text = interaction.options.getString("text");
		console.log(
			"Someone threw you a message! I wonder who...\n\n"
			+text+
			"\n\nFrom, "+interaction.user.username
		);
		const quote = "> "+(text.trim().replace(/(.*)\n/g, "$1\n> "));
		await interaction.editReply("Message thrown!:\n"+quote);
	}
}