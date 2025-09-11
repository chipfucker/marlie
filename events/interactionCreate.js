const { Events, MessageFlags } = require("discord.js");
const { post } = require("../utility/rule34api");
const { searchEmbed } = require("../utility/embed");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: "### ERROR:\n```\n"+error+"\n```" });
				} else {
					await interaction.reply({ content: "### ERROR:\n```\n"+error+"\n```" });
				}
			}
		} else if (interaction.isButton()) {
			switch (interaction.customId) {
				case "search_prev": {
					const messageJson = interaction.message.content.replace(
						/\|\|```json\n(.*)\n```\|\|/, "$1");
					const json = JSON.parse(messageJson);
					// TODO: implement custom sorting
					const sortDir = (json.sort.dir==="desc") ? "asc" : "desc";
					const sortCom = (json.sort.dir==="desc") ? ">" : "<";
					const data = await post(`${json.query} id:>${json.id} sort:id:asc`);
					if (!data) {
						await interaction.followUp({ content: "No more results this way! "});
						return;
					}
					
					const messageData = {
						query: json.query,
						id: data.info.file.id,
						general: json.general
					};
			
					const message = searchEmbed(json.query, data, json.general);
			
					interaction.update({
						content: `||\`\`\`json\n${JSON.stringify(messageData)}\n\`\`\`||`,
						embeds: [message.embed],
						components: [message.buttons]
					});
				} break;
				case "search_next": {
					const messageJson = interaction.message.content.replace(
						/\|\|```json\n(.*)\n```\|\|/, "$1");
					const json = JSON.parse(messageJson);
					const data = await post(`${json.query} id:<${json.id} sort:id:desc`);
					if (!data) {
						await interaction.followUp({ content: "No more results this way! "});
						return;
					}
					
					const messageData = {
						query: json.query,
						id: data.info.file.id,
						general: json.general
					};
			
					const message = searchEmbed(json.query, data, json.general);
			
					interaction.update({
						content: `||\`\`\`json\n${JSON.stringify(messageData)}\n\`\`\`||`,
						embeds: [message.embed],
						components: [message.buttons]
					});
				} break;

				case "thread_next": {

				} break;

				case "thread_like:": {

				} break;
				case "thread_unlike": {

				} break;

				case "thread_source": {

				} break;

				case "thread_save": {

				} break;
			}
		}
	},
};
