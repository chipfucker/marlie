const {
	ActionRowBuilder,
	ButtonStyle,
	ChannelManager,
	MessageFlags,
	SlashCommandBuilder
} = require("discord.js");
const { post } = require ("../../utility/rule34api.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mthread")
		.setDescription("Create a thread in #search")
		.addStringOption(option => option
			.setName("q")
			.setDescription("Search query")
			.setRequired(true)),
	async execute(interaction) {
		const query = interaction.options.getString("q");
		await interaction.reply({ content: "Creating thread..." });
		const searchChannel = await interaction.client.channels.fetch("1415155574026403840");

		const data = await post(query);
		if (!data) {
			await interaction.editReply({ content: `No results for \`${query}\`!` });
			return;
		}

		const threadData = {
			query: query,
			id: data.info.file.id,
			index: 1,
			likes: 0,
			sources: 0,
			saves: 0
		};
		const content =
			`Index: ${threadData.index}\n`+
			`Likes: ${threadData.likes}\n`+
			`Sources: ${threadData.sources}\n`+
			`Saves: ${threadData.saves}\n`+
			`\n||\`\`\`json\n${JSON.stringify(threadData)}\n\`\`\`||`;

		const thread = await searchChannel.threads.create({
			name: query,
			message: {
				content: content
			},
			appliedTags: [
				"1415156598929625108", // "Test" tag
				"1415395178742681742"
			]
		});
		await interaction.editReply({ content: "Adding you to the thread..." });
		await thread.members.add(interaction.user.id);
		await interaction.editReply({ content: "Sending first message..." });
		await thread.send({ embeds: [{
			description: "first message"
		}]});

		await interaction.editReply({ content:
			`Created **${query}** thread in <#1415155574026403840>\n## <#${thread.id}>`
		});
	}
};