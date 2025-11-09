import * as Discord from "discord.js";
import { channel as secret } from "#root/secret.js";

export const data = {
    name: "qsave",
    abbr: "qs",
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

export async function ChatInputCommandInteraction(i) {
    const defer = i.reply({
        flags: [
            Discord.MessageFlags.Ephemeral,
            Discord.MessageFlags.SuppressNotifications
        ],
        content: "Getting URLs..."
    });

    const links = i.options.getString("urls").split(/\s+/);
    
    if (!links.every(url => URL.canParse(url))) {
        await defer.then(() => i.editReply({
            content: "One of the URLs was not parsable!"
        }));
        return;
    }

    const channel = await i.client.channels.fetch(secret.save.id);
    await execute(channel, links);

    await defer.then(() => i.editReply({
        content: `Sent ${links.length} link${links.length===1?"":"s"} to ${channel.url}!`
    }));
}

export async function MessageContextMenuCommandInteraction(i) {
    const defer = i.reply({
        flags: [
            Discord.MessageFlags.Ephemeral,
            Discord.MessageFlags.SuppressNotifications
        ],
        content: "Getting URLs..."
    });

    /* possible regex:
        /Tags: .*?\n(?:\n.*\[Source\]\(<(.*?)>\))+(?:\n\n.*)/g
    */
}

async function execute(channel, links) {
    await channel.send({
        content: links.join("\n")
    });
}