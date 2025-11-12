import * as Discord from "discord.js";
import { channel as secret } from "#secret";
import * as post from "#lib/message/queue/post.js";

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

export async function ChatInputCommandInteraction(i) {
    Interaction(i, post.getFromParams(i.options.getString("urls")));
}

export async function MessageContextMenuCommandInteraction(i) {
    Interaction(i, post.getFromContent(i.targetMessage));
}

export async function messageCreate(m, args) {
    const defer = m.reply({
        allowedMentions: { repliedUser: false },
        content: "Getting URLs..."
    });

    const content = args
        ? post.getFromParams(args)
        : post.getFromContent(
            await m.channel.messages.fetch({ before: m.id, limit: 1, cache: false })
                .then(collection => collection.values().toArray()[0])
        );
        

    if (!content) {
        await defer.then(reply => reply.edit({
            allowedMentions: { repliedUser: false },
            content: "No URLs to send."
        }));
        return;
    }

    Promise.all([
        post.send({
            client: m.client,
            id: secret.save.id,
            content
        }),
        defer
    ]).then(promise => promise[1].edit({
        allowedMentions: { repliedUser: false },
        content: promise[0]
    }));
}

async function Interaction(i, content) {
    const defer = i.reply({
        flags: [ Discord.MessageFlags.Ephemeral ],
        content: "Getting URLs..."
    });

    if (!content) {
        await defer.then(() => i.editReply({ content: "No URLs found." }));
        return;
    }
    
    Promise.all([
        post.send({
            client: i.client,
            id: secret.save.id,
            content
        }),
        defer
    ]).then(promise => i.editReply({ content: promise[0] }));
}