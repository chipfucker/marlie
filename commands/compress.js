const {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonStyle,
	SlashCommandBuilder
} = require("discord.js");
const { post } = require ("../../utility/rule34api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mcompress")
		.setDescription("Compress image/video from URL")
		.addStringOption(option => option
			.setName("url")
			.setDescription("URL of file")
			.setRequired(true)),
	async execute(interaction) {
	}
}