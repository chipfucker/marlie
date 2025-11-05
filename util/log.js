import { Discord, CT } from "#util/discord.js";

export function throwError(error) {
	console.error(error);

	const message = {
		flags: Discord.MessageFlags.IsComponentsV2,
		components: [{ type: CT.Container,
			accentColor: 0xFF0000,
			components: [{ type: CT.TextDisplay,
				content: "### ERROR"
			},
			{ type: CT.TextDisplay,
				content: `\`\`\`\n${
					error.name}: ${error.message
				}\n\n${
					error.stack
				}\n\`\`\``
			}]
		}]
	};

	return message;
}