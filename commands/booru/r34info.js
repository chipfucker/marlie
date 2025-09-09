const {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	EmbedBuilder,
	SlashCommandBuilder
} = require('discord.js');
const { post } = require ("../../utility/api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('r34info')
		.setDescription('Get info of post')
		.addStringOption(option => option
			.setName("id")
			.setDescription("ID of post")
			.setRequired(true))
		.addBooleanOption(option => option
			.setName("raw")
			.setDescription("Whether to send as raw file"))
		.addBooleanOption(option => option
			.setName("general")
			.setDescription("Whether to include list of general tags")),
	async execute(interaction) {
		const id = interaction.options.getString("id")
			?.replace(/https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=(\d+)/, "$1");

		interaction.reply({embeds: [{
			"title": id,
			"description": "Loading..."
		}]});

		if (!id) {
			interaction.editReply({ content: "You must specify an ID or URL!", embed: [] });
			return;
		}

		const data = await post(id);
		
		const raw = interaction.options.getBoolean("raw");
		if (raw) {
			let content = JSON.stringify(data, null, 4);
			let attachment = new AttachmentBuilder(Buffer.from(content)).setName(`${id}-info.json`);
			interaction.editReply({ files: [attachment], embed: [] });
			return;
		}

		const embed = {
			thumbnail: {
				url: data.image.original
			},
			title: data.info.file.id,
			url: "https://rule34.xxx/index.php?p=..."+data.info.file.id,
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
					value: (()=>{
						if (data.tags.copyright)
							return data.tags.copyright.map(e => `- \`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
					inline: true
				},
				{
					name: "Character",
					value: (()=>{
						if (data.tags.character)
							return data.tags.character.map(e => `- \`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
					inline: true
				},
				{
					name: "Artist",
					value: (()=>{
						if (data.tags.artist)
							return data.tags.artist.map(e => `- \`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
					inline: true
				},
				{
					name: "General",
					value: (()=>{
						if (interaction.options.getBoolean("general"))
							if (data.tags.general.length)
								return data.tags.general.map(e => `- -# \`${e.name}\` (${e.count})`).join("\n");
							else return "-# **null**";
						else return `-# *\t${data.tags.general.length} tags*`;
					})(),
				},
				{
					name: "Meta",
					value: (()=>{
						if (data.tags.meta)
							return data.tags.artist.map(e => `- \`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
					inline: true
				}
			]
		};
		if (data.tags.other.length) embed.fields.push({
			name: "Other (null)",
			value: (()=> data.tags.other
				.map(e => `- \`${e.name}\` (${e.count}) TYPE: ${e.type}`)
				.join("\n")
			)(),
			inline: true
		});

		interaction.editReply({embeds: [embed]});
	}
};