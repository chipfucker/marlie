const { Events, ApplicationCommandType, InteractionType } = require("discord.js");
const buttonEvent = require("../utility/button.js");
const terminal = require("../utility/terminal.json");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const cmdString =
			`\x1b[96m\x1b[1mCMD\x1b[0m \x1b[97m${
				interaction.user.username
			}\x1b[0m ran \x1b[0m\x1b[1m${
				interaction.commandName || interaction.message.interaction.commandName
			}\x1b[0m \x1b[3m\x1b[90m(${
				ApplicationCommandType[interaction.commandType || interaction.message.interaction.type]
			} ${
				InteractionType[interaction.type]
			})\x1b[0m\x1b[2m`;
		console.log(cmdString);
		
		if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred)
					await interaction.followUp({ content: "### ERROR:\n```\n"+error+"\n```" });
				else
					await interaction.reply({ content: "### ERROR:\n```\n"+error+"\n```" });
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
