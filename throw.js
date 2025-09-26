const Discord = require("discord.js");
const { config } = require("./secrets.json");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

const message =
/*** MESSAGE ***/
`This is a test. Hello!!`
/*** MESSAGE ***/;

client.once("clientReady", async () => {
	console.log(`THROWING MESSAGE:\n  > ${message}`);
	const channel = await client.channels.fetch("1314695908621025310");
	await channel.send(message);
	console.log("MESSAGE THROWN");
	client.destroy();
	process.exit(0);
});

client.login(config.token);