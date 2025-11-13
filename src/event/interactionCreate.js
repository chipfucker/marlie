import * as Discord from "discord.js";
import * as com from "#lib/error.js";

export const name = Discord.Events.InteractionCreate;
export async function execute(i) {
    try { switch (true) {
        case i.isChatInputCommand():
        case i.isMessageContextMenuCommand(): {
            const name = i.client.aliases.get(i.commandName);
            const command = i.client.commands.get(name);
            console.log(`${i.user.username} used ${command.data.name} (${i.constructor.name} \u203a ${i.commandName})`);
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
            const [_, id, func, args] = i.customId.match(/(.+?):([^\?]+)\??(.*)/);
            // command:function?params;params
            const command = i.client.commands.get(id);
            console.log(`${i.user.username} used ${command.data.name} (${i.constructor.name} \u203a ${func})`);
            await command[func][i.constructor.name](i, args);
        } break;

        default: throw new Error(`This interaction type (${i.constructor.name}) is not supported yet.`);
    }} catch (error) {
        console.error(error);
        await i.user.send(com.error(error));
    }
}