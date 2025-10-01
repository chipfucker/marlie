import * as Discord from "discord.js";
import secrets from "./secrets.json" with { type: "json" };

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

const message = {
	content: "",
	flags: Discord.MessageFlags.IsComponentsV2,
	files: [],
	embeds: [],
	components: []
};

client.once("clientReady", async () => {
	console.log("THROWING MESSAGE:", message);
	const channel = await client.channels.fetch("1314695908621025310");
	await channel.send(message);
	console.log("MESSAGE THROWN");
	client.destroy();
	process.exit(0);
});

client.login(secrets.discord.token);