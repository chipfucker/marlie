const { Client, GatewayIntentBits } = require("discord.js");
const { config } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", async () => {
	console.log("EXECUTING TEST...");
	try {

		// TEST AREA [
		const { ApplicationCommandType } = require("discord.js");
		console.log(ApplicationCommandType[1]);
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