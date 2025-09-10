const {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonStyle,
	SlashCommandBuilder
} = require("discord.js");
const { post } = require ("../../utility/rule34api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("i")
		.setDescription("Get info of post")
		.addStringOption(option => option
			.setName("id")
			.setDescription("ID of post")
			.setRequired(true))
		.addBooleanOption(option => option
			.setName("raw")
			.setDescription("Whether to send as raw file"))
		.addBooleanOption(option => option
			.setName("general")
			.setDescription("Whether to include list of general tags"))
		.addBooleanOption(option => option
			.setName("comments")
			.setDescription("Whether to display comments")),
	async execute(interaction) {
		const id = interaction.options.getString("id")
			?.replace(/https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=(\d+)/, "$1");

		await interaction.reply({embeds: [{
			"title": id,
			"description": "Loading..."
		}]});

		if (!id || Number.isNaN(Number(id))) {
			interaction.editReply({ embeds: [{
				title: "You must specify an ID or URL!",
				color: 0xe9263d
			}]});
			return;
		}

		const data = await post(id);
		
		const raw = interaction.options.getBoolean("raw");
		if (raw) {
			let content = JSON.stringify(data, null, 4);
			let attachment = {
				attachment: Buffer.from(content),
				name: `${id}-info.json`
			};
			interaction.editReply({ files: [attachment], embeds: [] });
			return;
		}

		const postEmbed = {
			title: data.info.file.id,
			thumbnail: {
				url: data.image.original
			},
			url: "https://rule34.xxx/index.php?page=post&s=view&id="+data.info.file.id,
			description:
				`**Owner:** \`${data.info.post.creator.name}\`\n`+
				`**Score:** ${data.info.post.score}\n`+
				`**Created:** ${data.info.post.created}\n`+
				`**Updated:** ${data.info.post.updated}\n\n`+
				`**Source:** ${data.info.link.source ? "`"+data.info.link.source+"`" : "none"}\n`+
				`**Parent:** ${data.info.link.parent ? "`"+data.info.link.parent+"`" : "none"}\n`+
				`**Children:** ${data.info.link.children ? "yes" : "none"}\n\n`+
				`**Hash:** \`${data.info.file.hash}\`\n`+
				`**Path:** ${data.info.file.directory}/${data.info.file.filename}`,
			fields: [
				{
					name: "Copyright",
					value: (()=>{
						if (data.tags.copyright)
							return data.tags.copyright.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
				},
				{
					name: "Character",
					value: (()=>{
						if (data.tags.character)
							return data.tags.character.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
				},
				{
					name: "Artist",
					value: (()=>{
						if (data.tags.artist)
							return data.tags.artist.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})()
				},
				{
					name: "General",
					value: (()=>{
						if (interaction.options.getBoolean("general"))
							if (data.tags.general.length)
								return data.tags.general.map(e => `\`${e.name}\` (${e.count})`).join("\n");
							else return "-# **null**";
						else return `-# *${data.tags.general.length} tags*`;
					})(),
					inline: true
				},
				{
					name: "Meta",
					value: (()=>{
						if (data.tags.meta)
							return data.tags.meta.map(e => `\`${e.name}\` (${e.count})`).join("\n");
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

		const commentEmbeds = [];
		if (interaction.options.getBoolean("comments")) {
			const chunks = 1;
			const slice = 25;
			const max = chunks * slice - 1;

			const comments = data.comments.slice(0, max);
			const fields = comments.map(e=>({
				name: `${e.creator.name} » #${e.id}`,
				value: `> ${e.content}`
			}));
			for (let x = 0; x < fields.length; x += slice) commentEmbeds.push({
				fields: fields.slice(x, x+slice)
			});
			
			if (data.comments.length > max) commentEmbeds[chunks - 1].fields.push({
				name: "Wow, that's a lot of comments!",
				value:
					`There are ${data.comments.length - max} more comments after this one (that makes ${data.comments.length} total!).\n`
					+`[View the rest of the comments here...](https://rule34.xxx/index.php?page=post&s=view&id=${data.info.file.id})`
			});
		}

		interaction.editReply({embeds: [postEmbed, ...commentEmbeds]});
	}
};