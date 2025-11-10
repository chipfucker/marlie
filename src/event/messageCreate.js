import * as Discord from "discord.js";
import * as com from "#lib/message/error.js";

export const name = Discord.Events.MessageCreate;
export async function execute(m) {
    try {
        const match = m.content.match(/^\$(\S+)\s*(.*)/);
        if (!match) return;
        
        const emoji = "\ud83d\udd52"; // :clock3:
        const react = m.react(emoji);
        const [_, cmd, args] = match;

        const alias = m.client.aliases.get(cmd);
        if (!alias) return;
        const command = m.client.commands.get(alias);
        
        console.log(`${m.author.username} used ${command.data.name} (Message)`);
        await react.then(() => m.reactions.resolve(emoji).users.remove());
        await command.messageCreate(m, args);
    } catch (error) {
        console.error(error);
        await m.author.send(com.error(error));
    }
}