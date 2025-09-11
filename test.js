const { Client, GatewayIntentBits } = require("discord.js");
const { config } = require("./config.json");
const { post } = require("./utility/rule34api.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const fetch = require("node-fetch");
const FormData = require("form-data");
const { Readable } = require("stream");

client.once("clientReady", async () => {
	console.log("EXECUTING TEST...");
	try {

		// TEST AREA [
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