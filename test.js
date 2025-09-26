async function test(client) {
	const {rule34} = require("./utility/api.js");
	const emoji = require("./utility/emoji.json");
	const data = await rule34.post("id:5823623");
	console.log(data);

	function definition(object) {
		return Object.entries(object)
		.map(def => `${def[0]}: ${def[1]}`).join("\n")
	}

	function tags(object) {

	}

	const message = {
		flags: Discord.MessageFlags.IsComponentsV2,
		components: [
			{
				type: Discord.ComponentType.Container,
				components: [
					{
						type: Discord.ComponentType.Section,
						components: [
							{
								type: Discord.ComponentType.TextDisplay,
								content: "First result of `id:5823623`"
							},
							{
								type: Discord.ComponentType.TextDisplay,
								content: `## \`${data.id}\``
							},
							{
								type: Discord.ComponentType.TextDisplay,
								content: Object.entries({
									"Query URL": `https://rule34.xxx/index.php?page=post&s=list&tags=id%3a5823623`,
									"Post URL": `https://rule34.xxx/index.php?page=post&s=view&id=${data.id}`,
									"Image URL": data.image.main.url
								}).map(def => `[${def[0]}](${def[1]})`).join("\n")
							}
						],
						accessory: {
							type: Discord.ComponentType.Thumbnail,
							media: {
								url: "https://api-cdn.rule34.xxx/images/5109/0966b7bb5f64f30010d14d5e98bb81e4.jpeg"
							}
						}
					},
					{
						type: Discord.ComponentType.Separator,
						divider: true,
						spacing: 2
					},
					{
						type: Discord.ComponentType.TextDisplay,
						content: definition({
							"Creator": `\`${data.creator.name}\``,
							"Score": `${data.score}`
						})
					},
					{
						type: Discord.ComponentType.Separator,
						divider: false,
						spacing: 1
					},
					{
						type: Discord.ComponentType.TextDisplay,
						content: definition({
							"Created": data.created.string,
							"Updated": data.updated.string
						})
					},
					{
						type: Discord.ComponentType.Separator,
						divider: false,
						spacing: 1
					},
					{
						type: Discord.ComponentType.TextDisplay,
						content: definition({
							"Source": data.source ?? "none",
							"Parent": data.parent ? `\`${data.parent}\`` : "none",
							"Children": data.children.length
								? `\n${emoji.indent}\`${data.children.join(`\`\n${emoji.indent}\``)}\``
								: "none"
						})
					},
					{
						type: Discord.ComponentType.Separator,
						divider: false,
						spacing: 1
					},
					{
						type: Discord.ComponentType.TextDisplay,
						content: definition({
							"Directory": data.image.directory,
							"Hash": data.image.hash
						})
					},
					{
						type: Discord.ComponentType.Separator,
						divider: true,
						spacing: 2
					}
				]
			}
		]
	};

	const colors = {
		copyright: 0xff44d9,
		character: 0x56ff7d,
		artist: 0xf4404b,
		general: 0x23a2ff,
		metadata: 0xffeb5f,
		other: null,
		null: 0xffffff
	};

	for (const [key, value] of Object.entries(data.tags.category)) {
		if (value.length) message.components[0].components.push({
			type: Discord.ComponentType.TextDisplay,
			content: `### ${
				String(key).charAt(0).toUpperCase() + String(key).slice(1)
			}\n${ (() => {
				if (key === "general")
					return `*${value.length} tags*`;
				else if (key === "other")
					return value.map(e => `${e.type}: \`${e.name}\` (${e.count})`).join("\n");
				else return value.map(e => `\`${e.name}\` (${e.count})`).join("\n");
			})() }`
		});
	}

	const channel = await client.channels.fetch("1384093405017018399");
	await channel.send(message);
}

const Discord = require("discord.js");
const { config } = require("./secrets.json");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

client.once("clientReady", async (client) => {
	console.log("EXECUTING TEST...");
	try {
		await test(client);
		console.log("EXECUTED TEST");
	} catch (error) {
		console.log("ERROR: \n"+error);
	} finally {
		await client.destroy();
		process.exit(0);
	}
});

client.login(config.token);