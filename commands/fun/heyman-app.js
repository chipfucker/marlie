const Discord = require("discord.js");
const fs = require("node:fs");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("heyman")
		.setDescription("hey man")
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(i) {
		const message = JSON.parse(fs.readFileSync("commands/fun/heyman.json", "utf8"));
		await i.reply(message);
	}
}