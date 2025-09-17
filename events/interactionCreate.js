const { Events } = require("discord.js");
const { buttonEvent } = require("../utility/button");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		/*** OBJECT DEBUG ***/
		/** INHERITED LIST **/

		/** FULL LIST **/
		function flattenInteraction(obj) {
			const merged = {};
			const visited = new Set();
		  
			let current = obj;
			while (current && current !== Object.prototype) {
			  const keys = Object.getOwnPropertyNames(current);
			  const symbols = Object.getOwnPropertySymbols(current);
		  
			  for (const key of keys) {
				if (!(key in merged)) {
				  try {
					merged[key] = current[key];
				  } catch {
					merged[key] = '[unreadable]';
				  }
				}
			  }
		  
			  for (const sym of symbols) {
				const symKey = sym.toString();
				if (!(symKey in merged)) {
				  try {
					merged[symKey] = current[sym];
				  } catch {
					merged[symKey] = '[unreadable]';
				  }
				}
			  }
		  
			  current = Object.getPrototypeOf(current);
			}
		  
			return merged;
		  }
		  

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
