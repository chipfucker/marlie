const Discord = require("discord.js");
const fs = require("node:fs");
const terminal = require("../utility/terminal.json");

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,
	async execute(client) {
		const tag = `${
			terminal.color.fg.bright.red
			+ terminal.font.start.bold
		}RDY${terminal.font.reset}`;

		console.log(`${tag} logged into ${client.user.tag}`);
		await client.user.setActivity(fs.readFileSync("profile/status.txt", "utf8"), { type: 4 });
		console.log(`${tag} set status`);
	},
};
