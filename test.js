const { Client, GatewayIntentBits } = require("discord.js");
const { config } = require("../config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", async () => {
	console.log("EXECUTING TEST...");
	try {

		// TEST AREA [
		const channel = await client.channels.fetch("1394467910042255500");
		await channel.send("im boutta fart everywhere");
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