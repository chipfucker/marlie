const Discord = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
	data: new Discord.ContextMenuCommandBuilder()
		.setName("Throw message")
		.setType(3)
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(i) {
		if (i.channelId === "1384093405017018399") await i.deferReply();
		else await i.deferReply({ flags: 64 });

		const prefix = ("\x1b[93m\x1b[1mTHR\x1b[0m");
		console.log(`${prefix}\x1b[2m catching message as \x1b[0m"${i.id}"`);

		const catchPath = path.join("./catch");
		if (!fs.existsSync(catchPath)) fs.mkdirSync(catchPath);

		const file = path.join(catchPath, i.id + ".json");

		fs.writeFileSync(file, JSON.stringify(i.targetMessage, null, "\t"));

		console.log(`    MESSAGE THROWN: ${file}`);
		if (i.channelId === "1384093405017018399") {
			await i.editReply(`Message thrown!\n\`${file}\``);
		}
		else {
			const channel = await i.client.channels.fetch("1384093405017018399");
			const response = await channel.send(`Message thrown from <#${i.channelId}>!\n\`${file}\``);
			await i.editReply(`Message thrown! https://discord.com/channels/1294885290275770430/1384093405017018399/${response.id}`);
		}
	}
}