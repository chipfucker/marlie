import * as Discord from "discord.js";
import { channel as secret } from "#secret";

export const data = {
    name: "qhunt",
    abbr: "qh",
    types: {
        ChatInput: {
            name: "queue-hunt",
            description: `Send to #${secret.hunt.emoji}-hunts`,
            options: [{
                name: "urls",
                description: "Image URLs to send (separated by spaces)",
                type: Discord.ApplicationCommandOptionType.String,
                required: true
            }]
        },
        Message: {
            name: `${secret.hunt.emoji} Queue hunt`
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

    const files = i.options.getString("urls").split(/\s+/);

    if (!files.every(url => URL.canParse(url))) {
        await defer.then(() => i.editReply({
            content: "One of the URLs was not parsable!"
        }));
        return;
    }

    const channel = await i.client.channels.fetch(secret.hunt.id);
    await execute(channel, files);

    await defer.then(() => i.editReply({
        content: `Sent ${files.length} file${files.length===1?"":"s"} to ${channel.url}!`
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

    const urls = {
        attachments: i.targetMessage.attachments.values()
            .map(item => item.url).toArray(),
        stickers: i.targetMessage.stickers.values()
            .filter(item => item.format !== Discord.StickerFormatType.Lottie)
            .map(item => item.url).toArray()
    };
    
    const files = [].concat(...Object.values(urls));

    if (!files.length) {
        await defer.then(() => i.editReply({
            content: "No images to send."
        }));
        return;
    }

    const channel = await i.client.channels.fetch(secret.hunt.id);
    await execute(channel, files);

    await defer.then(() => i.editReply({
        content: `Sent ${files.length} file${files.length === 1 ? "" : "s"} to ${channel.url}!`
    }));
}

export async function messageCreate(m, args) {
    const defer = m.reply({
        allowedMentions: { repliedUser: false },
        content: "Getting URLs..."
    });

    const files = args.split(/\s+/);

    if (!files.every(url => URL.canParse(url))) {
        await defer.then(() => m.editReply({
            content: "One of the URLs was not parsable!"
        }));
        return;
    }

    const channel = await m.client.channels.fetch(secret.hunt.id);
    await execute(channel, files);

    await defer.then(reply => reply.edit({
        allowedMentions: { repliedUser: false },
        content: `Sent ${files.length} file${files.length === 1 ? "" : "s"} to ${channel.url}!`
    }));
}

async function execute(channel, files) {
    const amount = Math.ceil(files.length / 10);
    const messages = [];

    for (const index in Array(amount).fill(0)) {
        messages.push(channel.send({ files: files.slice(index, index + 10) }));
    }
    await Promise.all(messages);
}