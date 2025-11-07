import * as Discord from "discord.js";
import { channel as secret } from "#/secret.js"

export const data = {
    ready: false,
    name: "qhunt",
    abbr: "qh",
    alias: {
        ChatInput: "queue-hunt",
        Message: "Queue in #hunts"
    }
};

export async function MessageContextMenuCommandInteraction(i) {
    const defer = i.deferReply({ flags: [
        Discord.MessageFlags.Ephemeral,
        Discord.MessageFlags.IsComponentsV2,
        Discord.MessageFlags.SuppressNotifications
    ]});

    const files = [];

    const urls = {
        attachments: i.targetMessage.attachments.values()
            .map(item => item.url),
        stickers: i.targetMessage.stickers.values()
            .filter(item => item.format !== Discord.StickerFormatType.Lottie)
            .map(item => item.url)
    };
    
    files.concat(...Object.values(urls));

    if (!files.length) {
        await defer.then(() => i.editReply({ components: [
            { type: Discord.ComponentType.TextDisplay,
                content: "No images to send."
            }
        ]}));
        return;
    }

    const channel = await i.client.channels.fetch(secret.hunt.id);
    const messages = [];
    for (const index in Array(Math.ceil(files.length / 10))) {
        messages.push(channel.send({ files: files.slice(index, index + 10) }));
    }

    await Promise.all(messages);
    await i.editReply({ components: [
        { type: Discord.ComponentType.TextDisplay,
            content: `Sent ${files.length} file${files.length === 1 ? "" : "s"} to ${channel.url}!`
        }
    ]});
}