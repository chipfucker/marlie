async function test(client) {
}

const { Client, GatewayIntentBits } = require("discord.js");
const { config } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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