import * as Discord from "discord.js";

export const error = (error) => ({
    flags: Discord.MessageFlags.IsComponentsV2,
    components: [{ type: Discord.ComponentType.Container,
        accentColor: 0xec1342,
        components: [
            { type: Discord.ComponentType.TextDisplay,
                content: `# ${error.name}`
            },
            { type: Discord.ComponentType.TextDisplay,
                content: "```\n" + error.stack + "\n```"
            }
        ]
    }]
});