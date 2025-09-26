const fs = require("node:fs");
const path = require("node:path");
const Discord = require("discord.js");
const terminal = require("../utility/terminal.json");

module.exports = {
	name: Discord.Events.InteractionCreate,
	async execute(i) {
		const tag = `${
			terminal.color.fg.bright.cyan
			+ terminal.font.start.bold
		}CMD${terminal.font.reset}`;

		console.log(`${tag} ${
			terminal.color.fg.bright.white
		}${
			i.user.username
		}${
			terminal.color.fg.default
		} ran ${
			terminal.font.start.bold
		}${
			(i.commandName || i.message.interaction.commandName)
		}${
			terminal.font.reset
		} ${
			terminal.font.start.italic
			+ terminal.font.start.faint
		}(${
			Discord.ApplicationCommandType[i.commandType || i.message.interaction.type]
		} ${
			Discord.InteractionType[i.type]
		})${
			terminal.font.reset
		}`);
		
		if (i.isChatInputCommand() || i.isMessageContextMenuCommand()) {
			const command = i.client.commands.get(i.commandName);
			try {
				await command.execute(i);
			} catch (error) {
				console.error(error);
				if (i.replied || i.deferred)
					await i.followUp({ content: "### ERROR:\n```\n"+error+"\n```" });
				else
					await i.reply({ content: "### ERROR:\n```\n"+error+"\n```" });
			}
		} else if (i.isAutocomplete()) {
			const command = i.client.commands.get(i.commandName);
			try {
				await command.autocomplete(i);
			} catch (error) {
				console.error(error);
			}
		} else if (i.isButton()) {
			const id = i.customId.replace(/:/g, "/") + ".js";
			const path = path.join(__dirname, "events/button", id);
			const func = require(path);
			await func(i);
		}
	},
};
