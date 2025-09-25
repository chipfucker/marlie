const Discord = require("discord.js");

module.exports = {
	data: new Discord.ContextMenuCommandBuilder()
		.setName("Send to #image-search")
		.setType(3)
		.setIntegrationTypes(1).setContexts(0, 2),
	async execute(i) {
		await i.deferReply({ flags: 64 });

		const target = i.targetMessage;

		const message = {
			content: target.content,
			files: [],
			flags: 4
		};

		for (const [key, value] of target.attachments) {
			const file = await fetch(value.url)
				.then(e => e.arrayBuffer())
				.then(e => Buffer.from(e));
			message.files.push(file);
		}
		if (message.files.length < (10 - target.embeds.length)) for (const embed of target.embeds) {
		}
		
		const channel = await i.client.channels.fetch("1295111688881836203");
		const response = await channel.send(message);
		await i.editReply(`Message sent to ${response.channel.url}!\n${
			""
		}Jump back: ${i.targetMessage.url}`);
	}
}