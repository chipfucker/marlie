import * as Discord from "discord.js";

export const name = Discord.Events.MessageCreate;
export async function execute(m) {
    try {
        const [_, abbr, args] = m.content.match(/^\$(\S+)\s*(.*)/);
        if (!abbr) return;

        const command = m.client.commands.get(abbr)
            ?? m.client.commands.get(m.client.commands.abbr.get(abbr));
        if (!command) return;
        
        console.log(`${m.author.username} used ${command.data.name} (Message)`);

        await command.message(args);
    } catch (error) {
        console.error(error);
        await i.user.send({
            flags: Discord.MessageFlags.IsComponentsV2,
            components: [{ type: Discord.ComponentType.Container,
                accentColor: 0xec1342,
                components: [
                    { type: Discord.ComponentType.TextDisplay,
                        content: `# ${error.name}`
                    },
                    { type: Discord.ComponentType.TextDisplay,
                        content: `\`\`\`\n${
                            error.name}: ${error.message}\n\n${error.stack
                        }\n\`\`\``
                    }
                ]
            }]
        });
    }
}