import { createQueueCommand } from "#lib/command/queue.js";
import { channel as secret } from "#secret";

export const data = {
    name: "qpack",
    abbr: "p",
    types: {
        ChatInput: {
            name: "queue-pack",
            description: `Send to #${secret.pack.emoji}-packs`,
            options: [{
                name: "urls",
                description: "Image URLs to send (separated by spaces)",
                type: Discord.ApplicationCommandOptionType.String,
                required: true
            }]
        },
        Message: {
            name: `${secret.pack.emoji} Queue pack`
        }
    }
};

const gen = createQueueCommand(secret.pack.id);

export let {
    ChatInputCommandInteraction,
    MessageContextMenuCommandInteraction,
    messageCreate
} = gen;