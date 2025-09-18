const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`\x1b[91m\x1b[1mRDY\x1b[0m Logged into ${client.user.tag}`);
		client.user.setActivity("big butt", { type: 4 });
	},
};
