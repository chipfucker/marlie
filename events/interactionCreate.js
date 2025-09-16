const { Events } = require("discord.js");
const { buttonEvent } = require("../utility/button");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		console.log(`${interaction.user.username}: ran ${interaction.commandName}`);
		
		if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: "### ERROR:\n```\n"+error+"\n```" });
				} else {
					await interaction.reply({ content: "### ERROR:\n```\n"+error+"\n```" });
				}
			}
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.isButton()) {
			await buttonEvent(interaction);
		}
	},
};
