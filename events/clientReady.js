import * as Discord from "discord.js";
import * as fs from "node:fs";
import terminal from "#/utility/terminal.json" with { type: "json" };

export const name = Discord.Events.ClientReady;
export const once = true;
export async function execute(client) {
	const tag = `${terminal.color.fg.bright.red
		+ terminal.font.start.bold}RDY${terminal.font.reset}`;

	console.log(`${tag} logged into ${client.user.tag}`);
	await client.user.setActivity(fs.readFileSync("profile/status.txt", "utf8"), { type: 4 });
	console.log(`${tag} set status`);
}
