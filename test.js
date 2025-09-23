async function test(client) {
	const promise = await fetch("https://api-cdn.rule34.xxx/images/7752/61cff135b10c62b78681a577dc964e7e.jpeg");
	console.dir(promise, {depth: null});
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