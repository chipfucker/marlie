const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { post } = require ("./api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('r34.info')
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
				{ name: "True", value: true },
				{ name: "False", value: false }
			)),
	async execute(interaction) {
		const id = interaction.options.getString("id")
			|| interaction.options.getString("url")
				.replace(/https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=(\d+)/, "$1");

		const reply = interaction.reply({"embeds": [{
			"title": id,
			"description": "Loading..."
		}]});
		const data = post(id);
		
		const raw = interaction.options.getString("raw");
		if (raw) {
			let content = JSON.stringify(data, null, 4);
			let attachment = new discord.MessageAttachment(Buffer.from(content), 'info.json');
			interaction.channel.send({ files: [attachment] });
		}

		reply.edit({"embeds": [{

		}]})
	}
};