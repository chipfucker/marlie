const { ContextMenuCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("Throw message")
		.setType(3)
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(interaction) {
		if (interaction.channel.id === "1384093405017018399") await interaction.deferReply();
		else await interaction.deferReply({ flags: 64 });
		const message = interaction.targetMessage;
		console.dir(message.attachments, { depth: null });
		console.dir(message.embeds, { depth: null });
		const msgPath = "catch/" + interaction.id + "/";
		const msgFolder = fs.mkdir(msgPath, { recursive: true }, (err, path) => {
			if (err)
				if (err.code === "EEXIST") {
					const oldFiles = fs.readdirSync(msgPath);
				}
				else throw err;
			else return path;
		});
		console.log(msgFolder);
		let msgFile = "";
		let statement = "Message thrown!";
		let quote = "";
		let dataDisplay = "";
		if (message.content) {
			msgFile += `== CONTENT ==\n\n`;
			quote += message.content;
		}
		if (message.embeds.length) {
			msgFile.embeds = message.embeds;
			dataDisplay += `${message.embeds.length} embed${(message.embeds.length !== 1) ? "s" : ""}\n`;
		}
		if (message.attachments.size) {
			const attachmentFolder = fs.mkdirSync(msgFolder + "attachments/");
			msgFile.attachments = message.attachments.map(e => e.name);
			dataDisplay += `${message.attachments.length} attachment${(message.attachments.length !== 1) ? "s" : ""}\n`;
		}
		console.log(
			`\n######  Someone threw you a message! I wonder who...\n##\n##  ${
				quote.substring(4, quote.length).replace(/\n/g, "\n##  ")
			}\n##\n######  From, ${interaction.user.username}\n##  Saved to catch/`
		);
		if (interaction.channel.id === "1384093405017018399") {
			await interaction.editReply(`Message thrown!: >>> ${quote}`);
		}
		else {
			const channel = await interaction.client.channels.fetch("1384093405017018399");
			const response = await channel.send(`Message thrown from <#${interaction.channel.id}>!:\n\n${quote}`);
			await interaction.editReply(`Message thrown! https://discord.com/channels/1294885290275770430/1384093405017018399/${response}`);
		}
	}
}