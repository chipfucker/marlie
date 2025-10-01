import * as Discord from "discord.js";
import * as fs from "node:fs";
import * as tm from "#util/terminal.js";
const { tag, sub } = tm.tags.ready;

export const name = Discord.Events.ClientReady;
export const once = true;
export async function execute(client) {

	console.log(`${tag} logged into ${client.user.tag}`);
	await client.user.setActivity(
		fs.readFileSync("resource/profile/status.txt", "utf8"),
		{ type: Discord.ActivityType.Custom });
	console.log(`${sub} set status`);
}
