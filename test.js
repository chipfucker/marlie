const { Client, GatewayIntentBits } = require("discord.js");
const { config } = require("./config.json");
const { post } = require("./utility/rule34api.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", async () => {
	console.log("EXECUTING TEST...");
	try {

		// TEST AREA [
		const query = "angstrom id:<14761399 sort:id:desc";
		const data = await post(query);

		const embed = {
			author: {
				name: query,
				url: `https://rule34.xxx/index.php?page=post&s=view&tags=${encodeURIComponent(query)}`
				// TODO: adjust link
			},
			title: data.info.file.id,
			fields: [
				{
					name: "Copyright",
					value: (()=>{
						if (data.tags.copyright.length)
							return data.tags.copyright.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
				},
				{
					name: "Character",
					value: (()=>{
						if (data.tags.character.length)
							return data.tags.character.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
				},
				{
					name: "Artist",
					value: (()=>{
						if (data.tags.artist.length)
							return data.tags.artist.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})()
				},
				{
					name: "General",
					value: (()=>{
						if (false)
							if (data.tags.general.length)
								return data.tags.general.map(e => `\`${e.name}\` (${e.count})`).join("\n");
							else return "-# **null**";
						else return `-# *${data.tags.general.length} tags*`;
					})(),
					inline: (() => {
						if (false) return false;
						else return true;
					})()
				},
				{
					name: "Meta",
					value: (()=>{
						if (data.tags.meta.length)
							return data.tags.meta.map(e => `\`${e.name}\` (${e.count})`).join("\n");
						else return "-# **null**";
					})(),
					inline: true
				}
			],
			image: {
				url: data.image.original
			}
		};

		if (data.tags.other.length) embed.fields.push({
			name: "Other (null)",
			value: (()=> data.tags.other
				.map(e => `- \`${e.name}\` (${e.count}) TYPE: ${e.type}`)
				.join("\n")
			)(),
			inline: true
		});

		const channel = await client.channels.fetch("1384093405017018399");
		await channel.send({
			embeds: [embed]
		})
		// ] END TEST AREA
		
		console.log("EXECUTED TEST");
	} catch (error) {
		console.log("ERROR: \n"+error);
	} finally {
		client.destroy();
		process.exit(0);
	}
});

client.login(config.token);