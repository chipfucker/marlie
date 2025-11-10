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
    await execute(channel, links.join("\n"));

    await defer.then(() => i.editReply({
        content: `Sent ${links.length} link${links.length===1?"":"s"} to ${channel.url}!`
    }));
}

export async function MessageContextMenuCommandInteraction(i) {
    const defer = i.reply({
        flags: [ Discord.MessageFlags.Ephemeral ],
        content: "Getting URLs..."
    });

    const links = (() => {
        // TODO: verify user tag property works here
        if (i.targetMessage.author.tag === "Lawliet#5480")
            return i.targetMessage.content.match(/\[Source\]\(<(.+?)>\)/g)
                ?.map(item => item.match(/\[Source\]\(<(.+?)>\)/g)[1]);
        else
            return i.targetMessage.content.match(/(?:http|https|ftp):\/\/(?:\S*)/ig);
    })();

    if (!links) {
        await defer.then(() => i.editReply({
            content: "No URLs to send."
        }));
        return;
    }

    const channel = await i.client.channels.fetch(secret.save.id);
    await execute(channel, links.join("\n"));

    await defer.then(() => i.editReply({
        content: `Sent ${links.length} link${links.length===1?"":"s"} to ${channel.url}!`
    }));
}

export async function messageCreate(m, args) {
    const defer = m.reply({
        allowedMentions: { repliedUser: false },
        content: "Getting URLs..."
    });

    const channel = await m.client.channels.fetch(secret.save.id);

    if (args) {
        await execute(channel, args);
        await defer.then(() => m.editReply({
            allowedMentions: { repliedUser: false },
            content: `Sent content to ${channel.url}!`
        }));
        return;
    } else {
        const message = await m.channel.messages.fetch({ before: m.id, limit: 1, cache: false })
            .then(collection => collection.values().toArray()[0]);
        
        const links = (() => {

            if (message.author.tag === "Lawliet#5480")
                return message.content.match(/\[Source\]\(<(.+?)>\)/g)
                    ?.map(item => item.match(/\[Source\]\(<(.+?)>\)/g)[1]);
            else
                return message.content.match(/(?:http|https|ftp):\/\/(?:\S*)/ig);
        })();

        if (!links) {
            await defer.then(() => m.editReply({
                content: "No URLs to send."
            }));
            return;
        }
        
        await execute(channel, links.join("\n"));
        await defer.then(() => m.editReply({
            content: `Sent ${links.length} link${links.length===1?"":"s"} to ${channel.url}!`
        }));
    }
}

async function execute(channel, links) {
    await channel.send({
        content: links
    });
}