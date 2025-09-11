const {
	ActionRowBuilder,
	ButtonStyle,
	ChannelManager,
	MessageFlags,
	SlashCommandBuilder,
	ForumChannel
} = require("discord.js");
const { post } = require ("../../utility/rule34api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("msearch")
		.setDescription("Search from Rule34")
		.addStringOption(option => option
			.setName("q")
			.setDescription("Search query")
			.setRequired(true))
		.addBooleanOption(option => option
			.setName("raw")
			.setDescription("Whether to send as raw file"))
		.addBooleanOption(option => option
			.setName("general")
			.setDescription("Whether to show general tags")),
	async execute(interaction) {
		const query = interaction.options.getString("q");
		await interaction.reply({ embeds: [{
			title: query,
			description: "Loading..."
		}]});

		const data = await post(query);
		if (!data) {
			await interaction.editReply({ embeds: [{
				title: `No results for \`${query}\`!`,
				color: 0xe9263d
			}]});
			return;
		}

		const messageData = {
			query: query,
			id: data.info.file.id
		};

		const embed = {
			author: {
				name: query,
				url: `https://rule34.xxx/index.php?page=post&s=view&tags=${encodeURIComponent(query)}`
				// TODO: adjust link
			},
			title: data.info.file.id,
			fields: [
				{
					name: "Copyright",
					value: (()=>{
						if (data.tags.copyright.length)
							return data.tags.copyright.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
				},
				{
					name: "Character",
					value: (()=>{
						if (data.tags.character.length)
							return data.tags.character.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
				},
				{
					name: "Artist",
					value: (()=>{
						if (data.tags.artist.length)
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
					inline: (() => {
						if (interaction.options.getBoolean("general")) return false;
						else return true;
					})()
				},
				{
					name: "Meta",
					value: (()=>{
						if (data.tags.meta.length)
							return data.tags.meta.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
					inline: true
				}
			],
			image: {
				url: data.image.original
			}
		};

		if (data.tags.other.length) embed.fields.push({
			name: "Other (null)",
			value: (()=> data.tags.other
				.map(e => `- \`${e.name}\` (${e.count}) TYPE: ${e.type}`)
				.join("\n")
			)(),
			inline: true
		});

		console.log(embed);

		interaction.editReply({
			// content: `||\`\`\`json\n${JSON.stringify(messageData, null, 4)}\n\`\`\`||`,
			embeds: [embed]
		});

		//  FORWARD: {query} id:<{id} sort:id:desc
		// BACKWARD: {query} id:>{id} sort:id:asc
	}
};
