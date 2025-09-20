const { ContextMenuCommandBuilder } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

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

		// set ./catch/message path
		const message = interaction.targetMessage;
		const msgPath = path.join("catch", interaction.id);

		// create message folder
		fs.mkdirSync(msgPath, (err) => { throw err; });

		// set quote variables
		let content;
		const dataDisplay = [];

		// CREATE FILES
		if (message.content) {
			fs.writeFileSync(path.join(msgPath, "content.txt"), message.content);
			content = (message.content.length > 128)
				? message.content.substring(0, 128) + "`\u2022 \u2022 \u2022`"
				: message.content;
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
			dataDisplay.push(`${message.attachments.size} attachment${(message.attachments.size !== 1) ? "s" : ""}`);
		}
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

		// set quote
		const data = (() => {
			if (dataDisplay.length) return "```\n"+dataDisplay.join("\n")+"\n```";
			else return null;
		})();
		const quote = [content, data].join("\n\n").trim();

		console.log(
			`\n######  Someone threw you a message! I wonder who...\n##\n##  ${
				quote.replace(/\n/g, "\n##  ")
			}\n##\n######  Saved to file://catch/${interaction.id}/`
		);

		if (interaction.channel.id === "1384093405017018399") {
			await interaction.editReply(`Message thrown!\n>>> ${quote}`);
		}
		else {
			const channel = await interaction.client.channels.fetch("1384093405017018399");
			const response = await channel.send(`Message thrown from <#${interaction.channel.id}>!\n>>> ${quote}`);
			await interaction.editReply(`Message thrown! https://discord.com/channels/1294885290275770430/1384093405017018399/${response.id}`);
		}
	}
}