import * as Discord from "discord.js";
import * as FileSystem from "node:fs/promises";

export const name = Discord.Events.ClientReady;
export const once = true;
export async function execute(client) {
    console.log(`Logged into ${client.user.tag}`);

    FileSystem.readFile("res/profile/status.txt", "utf8")
    .then(status => {
        client.user.setActivity(status, { type: Discord.ActivityType.Custom })
        console.log(`Set status: ${status}`);
    });
}