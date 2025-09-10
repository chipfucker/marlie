const { Events } = require("discord.js");
const test = require("./test.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`READY: Logged in as ${client.user.tag}`);
		await test(client);
	},
};
