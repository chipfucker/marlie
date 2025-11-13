import * as Discord from "discord.js";

export const data = {
    name: "hi",
    types: {
        ChatInput: {
            name: "hi",
            description: "aye bruh"
        },
        Message: {
            name: "hi"
        }
    }
};

export async function ChatInputCommandInteraction(i) {
    await Interaction(i);
}

export async function MessageContextMenuCommandInteraction(i) {
    await Interaction(i);
}

async function Interaction(i) {
    const content = await import(`./content.js?date=${Date.now()}`);
    i.reply(content.message);
}