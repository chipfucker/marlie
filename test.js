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
		const input = "https://api-cdn.rule34.xxx/images/6104/4b56415e63a55b8350e408643aad848d.png";
		const filename = input.split("/").pop();
		const promise = await fetch(input);
		const arrayBuffer = await promise.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const stream = Readable.from(buffer);
		
		const form = new FormData();
		form.append("file", stream, { filename, contentType: "image/png" });
		
		const response = await fetch("https://temp.sh/upload", {
			method: "POST",
			body: form,
			headers: form.getHeaders()
		});
		
		console.log((await response.text()).trim());
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