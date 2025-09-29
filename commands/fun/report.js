import * as Discord from "discord.js";
import * as fs from "node:fs";

export const data = new Discord.ContextMenuCommandBuilder()
	.setName("report")
	.setType(3)
	.setIntegrationTypes(1).setContexts(0, 2);
export async function execute(i) {
	await i.deferReply();

	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	const reported = {
		embeds: [{
			title: "Message successfully reported.",
			description: "We will update you when we've taken action.\nThank you for keeping our community safe!",
			color: 0xE9263d
		}]
	};

	const responded = {
		embeds: [{
			title: "Loading..."
		}]
	};

	const warning = {
		embeds: [{
			author: {
				name: "You've been warned!"
			},
			title: "Please refrain from activity that goes against policy.",
			description: `Reason for warn:\n>>> ${fs.readFileSync("commands/fun/report.txt", "utf8")}`,
			footer: {
				text: "You may be banned if you must be warned again!"
			},
			color: 0xFFD215
		}]
	};

	const warned = {
		embeds: [{
			title: "User warned!",
			description: "We have decided that this message goes against policy.\nThank you for keeping our community safe!",
			color: 5701501
		}]
	};

	await i.editReply(reported);
	await delay((Math.random() * 6000) + 4000);
	await i.editReply(responded);
	try { await i.client.users.cache.get(i.targetMessage.author.id).send(warning); }
	catch (e) {
		i.followUp({
			content: `couldn't dm user: ${e.message}`,
			flags: 64
		});
	}
	await i.editReply(warned);
}