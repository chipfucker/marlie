const { ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("Throw message")
		.setType(3)
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(interaction) {
		await interaction.deferReply({ messageFlags: 64 });
		const text = interaction.targetMessage.content;
		console.log(
			"-- Someone threw you a message! I wonder who...\n\n"
			+text+
			"\n\n-- From, "+interaction.user.username
		);
		const channel = await interaction.client.channels.fetch("1384093405017018399");
		await interaction.editReply(`Message thrown! <#${channel.id}>`);
		
		const quote = "> "+(text.trim().replace(/(.*)\n/g, "$1\n> "));
		channel.send(`Message thrown from <#${interaction.channel.id}>!:\n\n${quote}`);
	}
}