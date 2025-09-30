import * as Discord from "discord.js";
import { rule34 } from "#util/api/index.js";

export const data = new Discord.SlashCommandBuilder()
	.setName("knit")
	.setDescription("Create a thread in #search")
	.addStringOption(option => option
		.setName("q")
		.setDescription("Search query")
		.setRequired(true));
export async function execute(i) {
	const query = i.options.getString("q");
	await i.reply({ content: "Creating thread..." });
	const searchChannel = await i.client.channels.fetch("1415155574026403840");

	const data = await rule34.post(query);
	if (!data) {
		await i.editReply({ content: `No results for \`${query}\`!` });
		return;
	}

	const threadData = {
		query: query,
		id: data.id,
		index: 1,
		likes: 0,
		packs: 0,
		saves: 0
	};
	const content = `Index: ${threadData.index}\n` +
		`Likes: ${threadData.likes}\n` +
		`Packs: ${threadData.packs}\n` +
		`Saves: ${threadData.saves}\n` +
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
	await i.editReply({ content: "Adding you to the thread..." });
	await thread.members.add(i.user.id);
	await i.editReply({ content: "Sending first message..." });
	await thread.send({
		embeds: [{
			description: "first message"
		}]
	});

	await i.editReply({
		content: `Created **${query}** thread in <#1415155574026403840>\n## <#${thread.id}>`
	});
}