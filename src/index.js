import * as Discord from "discord.js";
import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import { bot as secret } from "#secret";

const client = new Discord.Client({ intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent
]});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// TODO: compare cmdFiles to written file and only proceed if different
const cmdPath = Path.resolve("src/command");
FileSystem.readdir(cmdPath, { recursive: true })
.then(async list => {
    const cmdFiles = list.filter(file => file.match(/command\.js$/));
    for (const file of cmdFiles) {
        getImport(cmdPath, file).then(command => {
            if (command.data) {
                client.commands.set(command.data.name, command);
                for (const alias of Object.values(command.data.types)) {
                    client.aliases.set(alias.name, command.data.name);
                }
                if (command.data.abbr) {
                    client.aliases.set(command.data.abbr, command.data.name);
                }
            }
        });
    }
});

const eventPath = Path.resolve("src/event");
FileSystem.readdir(eventPath, { recursive: true })
.then(async list => {
    const eventFiles = list.filter(file => file.match(/\.js$/));
    for (const file of eventFiles) {
        const event = await getImport(eventPath, file);
        if (event.once)
            client.once(event.name, event.execute);
        else
            client.on(event.name, event.execute);
    }
});

async function getImport(dir, file) {
    const path = Path.join(dir, file);
    const url = new URL(`file://${path}`).href;
    // TODO: adjust url until as simple as possible
    return await import(url);
}

client.login(secret.token);