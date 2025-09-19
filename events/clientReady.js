const { Events } = require("discord.js");
const fs = require("node:fs");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`\x1b[91m\x1b[1mRDY\x1b[0m logged into ${client.user.tag}`);
		client.user.setActivity(fs.readFileSync("profile/status.txt", "utf8"), { type: 4 });
		console.log(`\x1b[91m\x1b[1mRDY\x1b[0m set status`);
	},
};
