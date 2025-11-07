import * as Discord from "discord.js";
import { channel as secret } from "#/secret.js";

export const data = {
    name: "Queue for hunting",
    type: Discord.ApplicationCommandType.Message,
    integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
    contexts: [
        Discord.InteractionContextType.Guild,
        Discord.InteractionContextType.PrivateChannel
    ]
};

export async function application(i) {
    
}