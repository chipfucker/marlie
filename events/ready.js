const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`READY: Logged into ${client.user.tag}`);
	},
};
