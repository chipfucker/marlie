import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as nodePath from "node:path";
import { bot as secret } from "#root/secret.js";

const commands = [];
const cmdPath = nodePath.resolve("cmd");
const cmdFiles = fs.readdirSync(cmdPath, { recursive: true })
    .filter(file => file.match(/command\.js$/));

(async () => {
    for (const file of cmdFiles) {
        const path = nodePath.join(cmdPath, file);
        const url = new URL(`file://${path}`).href;
        const command = await import(url);
        for (const [type, alias] of Object.entries(command.data.alias)) {
            commands.push({
                name: alias,
                type: Discord.ApplicationCommandType[type],
                integration_types: [ Discord.ApplicationIntegrationType.UserInstall ],
                contexts: [
                    Discord.InteractionContextType.Guild,
                    Discord.InteractionContextType.PrivateChannel
                ]
            });
        }
    }
})();

console.debug(commands);

const rest = new Discord.REST().setToken(secret.token);

(async () => {
    await Promise.all([
        rest.put(Discord.Routes.applicationCommands(secret.clientId), { body: []})
            .then(() => console.log("Deleted app commands")).catch(console.error),
        rest.put(Discord.Routes.applicationGuildCommands(secret.clientId, secret.guildId), { body: []})
            .then(() => console.log("Deleted guild commands")).catch(console.error)
    ]);
    await rest.put(Discord.Routes.applicationCommands(secret.clientId), { body: commands })
        .then(() => console.log("Added commands")).catch(console.error);
})();