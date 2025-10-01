import * as Discord from "discord.js";
import * as fs from "node:fs";

export const data = {
	name: "report",
	type: Discord.ApplicationCommandType.Message,
	integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
	contexts: [
		Discord.InteractionContextType.Guild,
		Discord.InteractionContextType.PrivateChannel
	]
};
export async function execute(i) {
	await i.deferReply();

	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	const reported = {
		embeds: [{
			title: "Message successfully reported.",
			description: "We will update you when we've taken action.\nThank you for keeping our community safe!",
			color: 0xE9263D
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
			color: 0x56FDBB
		}]
	};

	await i.editReply(reported);
	await delay((Math.random() * 6000) + 4000);
	await i.editReply(responded);
	try { await i.client.users.cache.get(i.targetMessage.author.id).send(warning); }
	catch (e) {
		i.followUp({
			content: `couldn't dm user: ${e.message}`,
			flags: Discord.MessageFlags.Ephemeral
		});
	}
	await i.editReply(warned);
}