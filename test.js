async function test(client) {
	const { rule34 } = require("./config.json");
	console.log(rule34);
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