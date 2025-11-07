import * as Discord from "discord.js";
import * as com from "#util/com/error.js";

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
        await m.author.send(com.error(error));
    }
}