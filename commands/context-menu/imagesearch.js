const { ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("Send to #image-search")
		.setType(3)
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(interaction) {
		await interaction.deferReply({ flags: 64 });
		await interaction.editReply("TODO");
	}
}