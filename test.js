async function test(client) {
	const message = {
		flags: Discord.MessageFlags.IsComponentsV2,
		components: [{
			type: Discord.ComponentType.ActionRow,
			components: [{
				type: Discord.ComponentType.Button,
				custom_id: "this/is/a/test",
				label: "label",
				style: Discord.ButtonStyle.Secondary
			}]
		}]
	};
	const channel = await client.channels.fetch("1314695908621025310");
	await channel.send(message);
}

import * as Discord from "discord.js";
import secrets from "./secrets.json" with { type: "json" };

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

client.login(secrets.discord.token);