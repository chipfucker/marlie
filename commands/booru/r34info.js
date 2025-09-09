const { Client, AttachmentBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { post } = require ("../../utility/api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('r34info')
		.setDescription('Get info of post')
		.addStringOption(option => option
			.setName("id")
			.setDescription("ID of post"))
		.addStringOption(option => option
			.setName("url")
			.setDescription("URL of post"))
		.addStringOption(option => option
			.setName("raw")
			.setDescription("Whether to send as raw file")
			.addChoices(
				{ name: "True", value: "true" },
				{ name: "False", value: "false" }
			)),
	async execute(interaction) {
		const id = interaction.options.getString("id")
			|| interaction.options.getString("url")
				.replace(/https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=(\d+)/, "$1");

		interaction.deferReply({embeds: [{
			"title": id,
			"description": "Loading..."
		}]});
		const data = await post(id);
		console.log(data);
		
		const raw = interaction.options.getString("raw") == "true";
		if (raw) {
			let content = JSON.stringify(data, null, 4);
			let attachment = new AttachmentBuilder(Buffer.from(content)).setName(`${id}-info.json`);
			interaction.editReply({ files: [attachment] });
			return;
		}

		interaction.editReply({embeds: [{
			
		}]});
	}
};