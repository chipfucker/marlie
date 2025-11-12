import * as Discord from "discord.js";
import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import { bot as secret } from "#secret";

const commands = [];
const cmdPath = Path.resolve("src/command");

(async () => {
    const cmdFiles = await FileSystem.readdir(cmdPath, { recursive: true })
        .filter(file => file.match(/command\.js$/));
    for (const file of cmdFiles) {
        const path = Path.join(cmdPath, file);
        const url = new URL(`file://${path}`).href;
        const command = await import(url);
        for (const [type, data] of Object.entries(command.data.types)) {
            data.type = Discord.ApplicationCommandType[type];
            data.integration_types = [ Discord.ApplicationIntegrationType.UserInstall ];
            data.contexts = [
                Discord.InteractionContextType.Guild,
                Discord.InteractionContextType.PrivateChannel
            ];

            commands.push(data);
        }
    }
})();

const rest = new Discord.REST().setToken(secret.token);

(async () => {
    await Promise.all([
        rest.put(Discord.Routes.applicationCommands(secret.clientId), { body: [] })
            .then(() => console.log("Deleted app commands")).catch(console.error),
        rest.put(Discord.Routes.applicationGuildCommands(secret.clientId, secret.guildId), { body: [] })
            .then(() => console.log("Deleted guild commands")).catch(console.error)
    ]);
    await rest.put(Discord.Routes.applicationCommands(secret.clientId), { body: commands })
        .then(() => console.log("Added commands")).catch(console.error);
})();