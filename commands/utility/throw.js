const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("throw")
		.setDescription("DEPRECATED; Use message context menus to throw")
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(interaction) {
		await interaction.reply("`/throw` is now deprecated. Send and/or right-click or long-press a message to throw its content!");
	}
}