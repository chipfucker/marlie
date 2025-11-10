import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as nodePath from "node:path";
import { bot as secret } from "#secret";

const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent
]});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const cmdPath = nodePath.resolve("src/cmd");
const cmdFiles = fs.readdirSync(cmdPath, { recursive: true })
    .filter(file => file.match(/command\.js$/));

// TODO: compare cmdFiles to written file and only proceed if different
(async () => {
    for (const file of cmdFiles) {
        const command = await getImport(cmdPath, file);

        if (command.data) {
            client.commands.set(command.data.name, command);
            for (const alias of Object.values(command.data.types)) {
                client.aliases.set(alias.name, command.data.name);
            }
            if (command.data.abbr) {
                client.aliases.set(command.data.abbr, command.data.name);
            }
        }
    }
})();

const eventPath = nodePath.resolve("src/event");
const eventFiles = fs.readdirSync(eventPath, { recursive: true })
    .filter(file => file.match(/\.js$/));

(async () => {
    for (const file of eventFiles) {
        const event = await getImport(eventPath, file);
        if (event.once)
            client.once(event.name, event.execute);
        else
            client.on(event.name, event.execute);
    }
})();

async function getImport(dir, file) {
    const path = nodePath.join(dir, file);
    const url = new URL(`file://${path}`).href;
    // TODO: adjust url until as simple as possible
    return await import(url);
}

client.login(secret.token);