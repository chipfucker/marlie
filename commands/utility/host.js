const Discord = require("discord.js");

const fetch = require("node-fetch");
const FormData = require("form-data");
const { Readable } = require("stream");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("host")
		.setDescription("Host image/video file on temp.sh")
		.setIntegrationTypes(1).setContexts(0, 2)
		.addStringOption(option => option
			.setName("url")
			.setDescription("URL of file")
			.setRequired(true)),
	async execute(i) {
		await i.reply({ content: "Fetching..." });

		const input = await i.options.getString("url");

		const pathname = new URL(input).pathname.split("/").pop();
		const promise = await fetch(input);
		if (!promise.ok) {
			i.editReply({
				content: "There was a bad response from "+input+"!"
			});
			return;
		}
		
		const filename = pathname.includes(".") ? pathname : pathname ? `${pathname}.${promise.headers.get("content-type").split("/").pop()}` : "file";
		
		await i.editReply({ content: "Buffering..." });
		const arrayBuffer = await promise.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const stream = Readable.from(buffer);
		
		await i.editReply({ content: "Creating form..." });
		const form = new FormData();
		form.append("file", stream, filename);

		await i.editReply({ content: "Uploading..." });
		const response = await fetch("https://temp.sh/upload", {
			method: "POST",
			body: form,
			headers: form.getHeaders()
		});

		if (!response.ok) {
			i.editReply({
				content: "There was a bad response from temp.sh!"
			});
			return;
		}
	
		const url = await response.text();

		i.editReply({ content: `Uploaded content!\n${url}` });
	}
}