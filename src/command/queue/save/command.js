import * as Discord from "discord.js";
import { createCommand } from "#lib/command/queue/post.js";
import { channel as secret } from "#secret";

export const data = {
    name: "qsave",
    abbr: "s",
    types: {
        ChatInput: {
            name: "queue-save",
            description: `Send to #${secret.save.emoji}-saves`,
            options: [{
                name: "urls",
                description: "Image URLs to send (separated by spaces)",
                type: Discord.ApplicationCommandOptionType.String,
                required: true
            }]
        },
        Message: {
            name: `${secret.save.emoji} Queue save`
        }
    }
};

const gen = createCommand(secret.save.id);

export let {
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    messageCreate
} = gen;