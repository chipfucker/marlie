const Discord = require("discord.js");
const { rule34 } = require ("../../utility/api.js");

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName("inspect")
		.setDescription("Get info of post")
		.setIntegrationTypes(1).setContexts(0, 2)
		.addStringOption(option => option
			.setName("q")
			.setDescription("Query for post")
			.setRequired(true))
		.addBooleanOption(option => option
			.setName("raw")
			.setDescription("Whether to send as raw file"))
		.addBooleanOption(option => option
			.setName("general")
			.setDescription("Whether to include list of general tags"))
		.addBooleanOption(option => option
			.setName("comments")
			.setDescription("Whether to display comments")),
	async execute(i) {
		var query = i.options.getString("q");
		for (const regex of [
			// Post URL
			/^https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=(\d+)$/,
			// Image URL

			// Digits by themselves
			/^(\d+)$/
		]) if (query.match(regex)) {
			query = query.replace(regex, "id:$1"); break;
		}

		await i.reply({embeds: [{
			title: query,
			description: "Loading..."
		}]});

		if (!query) {
			i.editReply({ embeds: [{
				title: "You must specify a query or applicable URL!",
				color: 0xe9263d
			}]});
			return;
		}

		const data = await rule34.post(query);
		if (!data) {
			i.editReply({ embeds: [{
				title: `No results for \`${query}\`!`,
				color: 0xe9263d
			}]});
			return;
		}
		
		if (i.options.getBoolean("raw")) {
			let content = JSON.stringify(data, null, 4);
			let attachment = {
				attachment: Buffer.from(content),
				name: `${data.id}-info.json`
			};
			i.editReply({ files: [attachment], embeds: [] });
			return;
		}

		// TODO: add to embed.js
		const postEmbed = {
			author: {
				name: `First result of ${query}`,
				url: "https://rule34.xxx/index.php?page=post&s=view&id="+data.id
			},
			title: `\`${data.id}\``,
			thumbnail: {
				url: data.image.main.url
			},
			description:
				`**Image URL:** \`${data.image.main.url}\`\n`+
				`**Creator:** \`${data.creator.name}\`\n`+
				`**Score:** ${data.score}\n`+
				`**Created:** ${data.created.string}\n`+
				`**Updated:** ${data.updated.string}\n\n`+
				`**Source:** ${data.source || "none"}\n`+
				`**Parent:** ${data.parent ? `\`${data.parent}\`` : "none"}\n`+
				`**Children:**${data.children.length
					? "\n<:indent:1420550819568423043>" + data.children.join("\n<:indent:1420550819568423043>")
					: "none"}\n\n`+
				`**Hash:** \`${data.image.hash}\`\n`,
			fields: []
		};

		for (const [key, value] of Object.entries(data.tags.category)) {
			if (value.length) postEmbed.fields.push({
				name: String(key).charAt(0).toUpperCase() + String(key).slice(1),
				value: (() => {
					if (key === "general")
						if (i.options.getBoolean("general"))
							return value.map(e => `\`${e.name}\` (${e.count})`).join(", ");
						else return `*${value.length} tags*`;
					else if (key === "other")
						return value.map(e => `${e.type}: \`${e.name}\` (${e.count})`).join("\n");
					else return value.map(e => `\`${e.name}\` (${e.count})`).join("\n");
				})(),
				inline: true
			});
		}

		const commentEmbeds = [];
		if (i.options.getBoolean("comments")) {
			const chunks = 1;
			const slice = 25;
			const max = chunks * slice - 1;

			const comments = data.comments.slice(0, max);
			const fields = comments.map(e=>({
				name: `${e.creator.name} » #${e.id}`,
				value: `> ${e.content}`
			}));
			for (let x = 0; x < fields.length; x += slice) commentEmbeds.push({
				fields: fields.slice(x, x+slice)
			});
			
			if (data.comments.length > max) commentEmbeds[chunks - 1].fields.push({
				name: "Wow, that's a lot of comments!",
				value:
					`There are ${data.comments.length - max} more comments after this one (that makes ${data.comments.length} total!).\n`
					+`[View the rest of the comments here...](https://rule34.xxx/index.php?page=post&s=view&id=${data.info.file.id})`
			});
		}

		i.editReply({embeds: [postEmbed, ...commentEmbeds]});
	}
};