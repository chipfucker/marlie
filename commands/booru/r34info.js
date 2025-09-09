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
			thumbnail: {
				url: data.image.original
			},
			author: {
				name: data.info.file.id,
				url: "https://rule34.xxx/index.php?p=..."+data.info.file.id
			},
			description:
				`**Owner:** \`${data.info.post.creator.name}\`\n`+
				`**Score:** ${data.info.post.score}\n`+
				`**Created:** ${data.info.post.created}\n`+
				`**Updated:** ${data.info.post.updated}\n\n`+
				`**Source:** \`${data.info.link.source}\`\n`+
				`**Parent:** \`${data.info.link.parent}\`\n`+
				`**Children?:** ${data.info.link.children ? "yes" : "no"}\n\n`+
				`**Hash:** \`${data.info.file.hash}\`\n`+
				`**Path:** ${data.info.file.directory}/${data.info.file.filename}`,
			fields: [
				{
					name: "Copyright",
					value: data.tags.copyright.map(e => `\`${e.name}\` (${e.count})`).join("\n"),
					inline: true
				},
				{
					name: "Character",
					value: data.tags.character.map(e => `\`${e.name}\` (${e.count})`).join("\n"),
					inline: true
				},
				{
					name: "Artist",
					value: data.tags.artist.map(e => `\`${e.name}\` (${e.count})`).join("\n"),
					inline: true
				},
				{
					name: "General",
					value: data.tags.general.map(e => `\`${e.name}\` (${e.count})`).join(",  "),
				},
				{
					name: "Meta",
					value: data.tags.meta.map(e => `\`${e.name}\` (${e.count})`).join(",  "),
					inline: true
				},
				{
					name: "Other (null)",
					value: data.tags.other.map(e => `\`${e.name}\` (${e.count})`).join("\n"),
					inline: true
				}
			]
		}]});
	}
};