import * as Discord from "discord.js";
import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import { bot as secret } from "#secret";

const client = new Discord.Client({ intents: [] });

const path = Path.resolve("res/profile");

client.once(Discord.Events.ClientReady, async client => {

});