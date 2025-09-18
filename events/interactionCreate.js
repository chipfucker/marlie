const { Events, ApplicationCommandType } = require("discord.js");
const { buttonEvent } = require("../utility/button");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const cmdString =
			`\x1b[96m\x1b[1mCOMMAND:\x1b[0m\x1b[2m \x1b[0m${
				interaction.user.username
			}\x1b[2m ran \x1b[3m${
				ApplicationCommandType[interaction.commandType]
			}\x1b[0m\x1b[2m command \x1b[0m"\x1b[1m${
				interaction.commandName
			}\x1b[0m"`;
		const separator = "\u2501".repeat(cmdString.replace(/\x1b\[\d+m/g, "").length);
		console.log(
			`\n  \u{2571}\u{2571} ${separator}\u2501\u2500\x1b[2m\u2500\x1b[0m` +
			`\n \u{2571}\u{2571}  ${cmdString}` +
			`\n\u{2571}\u{2571} \u2501\u2501${separator}\u2501\u2500\x1b[2m\u2500\x1b[0m\n`
		);
		
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
