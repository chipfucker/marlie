import * as Discord from "discord.js";

export const name = Discord.Events.InteractionCreate;
export async function execute(i) {
    console.log(`${i.user.username} used ${i.commandName || i.message.interaction.commandName} (${i.constructor.name})`);

    try { switch (true) {
        case i.isChatInputCommand():
        case i.isMessageContextMenu(): {
            const command = i.client.commands.get(i.commandName);
            await command.interaction(i);
        } break;

        case i.isAutocomplete(): {
            const command = i.client.commands.get(i.commandName);
            try {
                await command.autocomplete(i);
            } catch (error) {
                console.error(error);
            }
        } break;

        case i.isButton():
        case i.isModalSubmit: {
            const [_, id, param, args] = i.customId.match(/(.+?):([^\?]+)\??(.*)/);
            // command:function?params;params
            const command = i.client.commands.get(id);
            await command[param][i.constructor.name](i, args);
        } break;

        default: throw new Error(`This interaction type (${i.constructor.name}) is not supported yet.`);
    }} catch (error) {
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