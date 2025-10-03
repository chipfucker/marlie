async function test(client) {
	console.log(eval("Discord.ComponentType.Button"));
}

import * as Discord from "discord.js";
import secret from "./secret.json" with { type: "json" };

const client = new Discord.Client({ intents: [ Discord.GatewayIntentBits.Guilds ] });

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

client.login(secret.discord.token);