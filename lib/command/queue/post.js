import * as Discord from "discord.js";
import * as post from "#lib/message/parse/queue/post.js";

export function createCommand(channelId) {
    return {
        ChatInputCommandInteraction(i) {
            _Interaction(i, post.getFromParams(i.options.getString("urls")));
        },
        MessageContextMenuCommandInteraction(i) {
            _Interaction(i, post.getFromContent(i.targetMessage));
        },
        messageCreate(m, args) {
            const defer = m.reply({
                allowedMentions: { repliedUser: false },
                content: "Getting content..."
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
                    content: "Nothing to send."
                }));
                return;
            }
        
            Promise.all([
                post.send({
                    client: m.client,
                    id: channelId,
                    content
                }),
                defer
            ]).then(promise => promise[1].edit({
                allowedMentions: { repliedUser: false },
                content: promise[0]
            }));
        }
    };
}

async function _Interaction(i, content) {
    const defer = i.reply({
        flags: [ Discord.MessageFlags.Ephemeral ],
        content: "Getting content..."
    });

    if (!content) {
        await defer.then(() => i.editReply({ content: "No URLs found." }));
        return;
    }
    
    Promise.all([
        post.send({
            client: i.client,
            id: channelId,
            content
        }),
        defer
    ]).then(promise => i.editReply({ content: promise[0] }));
}