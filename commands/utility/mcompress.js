const { SlashCommandBuilder } = require("discord.js");

const fetch = require("node-fetch");
const FormData = require("form-data");
const { Readable } = require("stream");

const { post } = require ("../../utility/rule34api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mhost")
		.setDescription("Host image/video file on ")
		.addStringOption(option => option
			.setName("url")
			.setDescription("URL of file")
			.setRequired(true)),
	async execute(interaction) {
		await interaction.reply({ content: "Fetching..." });

		const input = await interaction.options.getString("url");
		const filename = input.split("/").pop().split("?")[0];
		const promise = await fetch(input);
		if (!promise.ok) {
			interaction.editReply({
				content: "There was a bad response from "+input+"!"
			});
			return;
		}
		
		await interaction.editReply({ content: "Buffering..." });
		const arrayBuffer = await promise.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const stream = Readable.from(buffer);
		
		await interaction.editReply({ content: "Creating form..." });
		const form = new FormData();
		form.append("file", stream, filename);

		await interaction.editReply({ content: "Uploading..." });
		const response = await fetch("https://temp.sh/upload", {
			method: "POST",
			body: form,
			headers: form.getHeaders()
		});

		if (!response.ok) {
			interaction.editReply({
				content: "There was a bad response from temp.sh!"
			});
			return;
		}
	
		const url = await response.text();

		interaction.editReply({ content:
			"Uploaded content!\n"+url
		});
	}
}