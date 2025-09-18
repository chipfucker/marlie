const { Client, GatewayIntentBits } = require("discord.js");
const { config } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", async () => {
	console.log("EXECUTING TEST...");
	try {

		// TEST AREA [
		const fs = require("node:fs");
		const contents = fs.readdirSync(__dirname);
		console.log(contents);
		// ] END TEST AREA
		
		console.log("EXECUTED TEST");
	} catch (error) {
		console.log("ERROR: \n"+error);
	} finally {
		client.destroy();
		process.exit(0);
	}
});

client.login(config.token);