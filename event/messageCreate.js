import * as Discord from "discord.js";
import * as com from "#util/com/error.js";

export const name = Discord.Events.MessageCreate;
export async function execute(m) {
    try {
        const [_, cmd, args] = m.content.match(/^\$(\S+)\s*(.*)/);
        if (!cmd) return;

        const alias = m.client.aliases.get(cmd);
        if (!alias) return;
        const command = m.client.commands.get(alias);
        
        console.log(`${m.author.username} used ${command.data.name} (Message)`);

        const splitArgs = args.split(/\s+/);
        await command.message(m, ...splitArgs);
    } catch (error) {
        console.error(error);
        await m.author.send(com.error(error));
    }
}