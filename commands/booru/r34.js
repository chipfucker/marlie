const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const saveChannel = await Client.channels.fetch("1340862369345175562");
const postChannel = await Client.channels.fetch("1295111950656868454");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('r34')
		.setDescription('Search from Rule34')
		.addStringOption(option =>
			option.setName("q")
				.setDescription("Search query")),
	async execute(interaction) {
		const query = interaction.options.getString("query");
		const reply = interaction.reply({"embeds": [{
			"title": query,
			"description": "Loading..."
		}]});

		// interaction.reply({"embeds": [{
		// 	"title": query,
		// 	"description": "# `1` post\n:package: 0\n:briefcase: 0",
		// 	"url": "url for query",
		// 	"thumbnail": {
		// 		"url": "thumbnail"
		// 	},
		// 	"footer": {
		// 		"text": "250 total results"
		// 	}
		// }]});
	}
};
