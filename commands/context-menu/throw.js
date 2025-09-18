const { ContextMenuCommandBuilder, MessageFlags } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("Throw message")
		.setType(3)
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(interaction) {
		if (interaction.channel.id === "1384093405017018399") await interaction.deferReply();
		else await interaction.deferReply({ flags: 64 });

		const prefix = ("\x1b[93m\x1b[1mTHR\x1b[0m");
		console.log(`${prefix}\x1b[2m catching message as \x1b[0m"${interaction.id}"`);

		// INITIAL VARIABLES
		const message = interaction.targetMessage;
		// console.dir(message, { depth: null }); // DEBUG
		// console.dir(message.attachments, { depth: null }); // DEBUG
		// console.dir(message.embeds, { depth: null }); // DEBUG
		const msgPath = path.join("catch", interaction.id);
		let statement = "Message thrown!";

		// CREATE / REPURPOSE FOLDER
		fs.mkdirSync(msgPath, { recursive: true }, (err, path) => {
			if (err?.code === "EEXIST") {
				statement = "Message rethrown!\n-# There was an existing folder with the same ID/name.";
				const oldFiles = fs.readdirSync(msgPath);
				console.log(oldFiles);
				for (const file of oldFiles) {
					console.log(file); // DEBUG
					fs.rename(path.join(msgPath, file), path.join(msgPath, "old", file))
				}
				return path;
			} else if (err) throw err;
			else return path;
		});

		// SUBINITIAL VARIABLES
		let quote = "";
		const dataDisplay = [];

		// CREATE FILES
		if (message.content) {
			fs.writeFileSync(path.join(msgPath, "content.txt"), message.content);
			quote += message.content;
		}
		if (message.attachments.size) {
			const filesPath = path.join(msgPath, "attachments");
			fs.mkdirSync(filesPath);
			for (const [key, value] of message.attachments) {
				const attachment = await fetch(value.url)
					.then(e => e.arrayBuffer())
					.then(e => Buffer.from(e));
				fs.writeFileSync(
					path.join(filesPath, `${value.id}~${value.name}`),
					attachment
				)
			}
			dataDisplay.push(`${message.attachments.size} attachment${(message.attachments.size !== 1) ? "s" : ""}\n`);
		}
		console.dir(message.embeds); // DEBUG
		if (message.embeds.length) {
			const embedsPath = path.join(msgPath, "embeds");
			fs.mkdirSync(embedsPath);
			for (const embed of message.embeds) {
				fs.writeFileSync(
					path.join(embedsPath, `${embed.data.id}.json`),
					JSON.stringify(embed, null, "\t")
				);
			}
			dataDisplay.push(`${message.embeds.length} embed${(message.embeds.length !== 1) ? "s" : ""}`);
		}
		/* console.log(
			`\n######  Someone threw you a message! I wonder who...\n##\n##  ${
				quote.replace(/\n/g, "\n##  ")
			}\n##\n######  From, ${interaction.user.username}\n##  Saved to catch/`
		); */
		console.log("caught as folder")
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