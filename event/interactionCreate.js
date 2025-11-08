import * as Discord from "discord.js";
import * as com from "#util/com/error.js";

export const name = Discord.Events.InteractionCreate;
export async function execute(i) {
    console.log(`${i.user.username} used ${i.commandName || i.message.interaction.commandName} (${i.constructor.name})`);

    try { switch (true) {
        case i.isChatInputCommand():
        case i.isMessageContextMenuCommand(): {
            const name = i.client.aliases.get(i.commandName);
            const command = i.client.commands.get(name);
            await command[i.constructor.name](i);
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
        case i.isModalSubmit(): {
            const [_, id, param, args] = i.customId.match(/(.+?):([^\?]+)\??(.*)/);
            // command:function?params;params
            const command = i.client.commands.get(id);
            await command[i.constructor.name][param](i, args);
        } break;

        default: throw new Error(`This interaction type (${i.constructor.name}) is not supported yet.`);
    }} catch (error) {
        console.error(error);
        await i.user.send(com.error(error));
    }
}