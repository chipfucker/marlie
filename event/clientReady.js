import * as Discord from "discord.js";
import * as fs from "node:fs";

export const name = Discord.Events.ClientReady;
export const once = true;
export async function execute(client) {
    console.log(`Logged into ${client.user.tag}`);

    const status = fs.readFileSync("resource/profile/status.txt", "utf8");
    client.user.setActivity(status, { type: Discord.ActivityType.Custom })
        .then(() => console.log(`Set status: ${status}`));
}