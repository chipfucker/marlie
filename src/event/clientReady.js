import * as Discord from "discord.js";
import * as FileSystem from "node:fs";

export const name = Discord.Events.ClientReady;
export const once = true;
export async function execute(client) {
    console.log(`Logged into ${client.user.tag}`);

    const status = FileSystem.readFileSync("src/res/profile/status.txt", "utf8");
    client.user.setActivity(status, { type: Discord.ActivityType.Custom })
    console.log(`Set status: ${status}`);
}