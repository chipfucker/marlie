async function test(client) {
	const terminal = require("./utility/terminal.json");
	console.log(
		`${terminal.color.fg.bright.red}this is red`
	)
}

const Discord = require("discord.js");
const { config } = require("./config.json");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

client.once("clientReady", async (client) => {
	console.log("EXECUTING TEST...");
	try {
		await test(client);
		console.log("EXECUTED TEST");
	} catch (error) {
		console.log("ERROR: \n"+error);
	} finally {
		await client.destroy();
		process.exit(0);
	}
});

client.login(config.token);