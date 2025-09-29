import * as Discord from "discord.js";
import emoji from "./emoji.json" with { type: "json" };

const embed = {
	inspect: {
		create: (query, data) => {
			const message = {
				flags: Discord.MessageFlags.IsComponentsV2,
				components: [{
					type: Discord.ComponentType.Container,
					components: [
						{
							type: Discord.ComponentType.Section,
							components: [
								{
									type: Discord.ComponentType.TextDisplay,
									content: `First result of \`${query}\``
								},
								{
									type: Discord.ComponentType.TextDisplay,
									content: `## ${data.id}`,
								},
								{
									type: Discord.ComponentType.TextDisplay,
									content: Object.entries({
										"Search URL": `https://rule34.xxx/?page=post&s=list&tags=${encodeURIComponent(query)}`,
										"Post URL": `https://rule34.xxx/?page=post&s=view&id=${data.id}`,
										"Image URL": data.image.main.url
									}).map(def => `[${ def[0] }](${ def[1] })`).join("\n")
								}
							],
							accessory: {
								type: Discord.ComponentType.Thumbnail,
								media: {
									url: data.image.thumbnail.url
								}
							}
						},
						{
							type: Discord.ComponentType.Separator,
							divider: true,
							spacing: Discord.SeparatorSpacingSize.Large
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
							spacing: Discord.SeparatorSpacingSize.Small
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
							spacing: Discord.SeparatorSpacingSize.Small
						},
						{
							type: Discord.ComponentType.TextDisplay,
							content: definition({
								"Source": data.source ?? "none",
								"Parent": data.parent ? `\`${data.parent}\`` : "none",
								"Children": data.children.length
									? data.children.map(id => `${emoji.indent}\`${id}\``).join("\n")
									: "none"
							})
						},
						{
							type: Discord.ComponentType.Separator,
							divider: false,
							spacing: Discord.SeparatorSpacingSize.Small
						},
						{
							type: Discord.ComponentType.TextDisplay,
							content: definition({
								"Directory": data.image.directory,
								"Hash": data.image.hash
							})
						}
					]
				}]
			};

			if (data.tags.array.length) {
				message.components[0].components.push({
					type: Discord.ComponentType.Separator,
					divider: true,
					spacing: Discord.SeparatorSpacingSize.Large
				});

				for (const [name, tags] of Object.entries(data.tags.category)) {
					if (tags.length) {
						if (name === "General") message.components[0].components.push(
							{
								type: Discord.ComponentType.TextDisplay,
								content: `### ${name}`
							},
							{
								type: Discord.ComponentType.ActionRow,
								components: [{
									type: Discord.ComponentType.Button,
									style: Discord.ButtonStyle.Secondary,
									label: `${tags.length} tags`,
									custom_id: "inspect:general:show"
								}]
							}
						);
						
						else message.components[0].components.push({
							type: Discord.ComponentType.TextDisplay,
							content: `### ${name}\n${ (() => {
								if (name === "Other")
									return tags.map(tag =>
										`${tag.type}: \`${tag.name}\` (${tag.count})`
									).join("\n");
								else return tags.map(tag =>
									`\`${tag.name}\` (${tag.count})`
								).join("\n")
							})() }`
						});
					}
				}
			}

			if (data.comments.length) message.components.push({
				type: Discord.ComponentType.Container,
				components: [
					{
						type: Discord.ComponentType.TextDisplay,
						content: `There are ${data.comments.length} comments under this post.`
					},
					{
						type: Discord.ComponentType.ActionRow,
						components: [{
							type: Discord.ComponentType.Button,
							style: Discord.ButtonStyle.Secondary,
							label: "Show comments",
							custom_id: "inspect:comments:show"
						}]
					}
				]
			});

			return message;
		},
		general: ({ tags: { category: { General: tags }}}) => {
			const content = `### General\n${
				tags.map(tag =>
					`\`${tag.name}\` (${tag.count})`
				).join("\n")
			}`;
			return content;
		}
	},
	showoff: () => {},
	searchEmbed: (query, data, general) => {
		const message = {
			embed: {
				author: {
					name: query,
					url: `https://rule34.xxx/index.php?page=post&s=view&tags=${encodeURIComponent(query)}`
					// TONOTDO: adjust link
				},
				title: `\`${data.id}\``,
				description: data.image.main.url,
				fields: [
					{
						name: "Copyright",
						value: (()=>{
							if (data.tags.category.copyright.length) {
								const str = data.tags.category.copyright.map(e => `\`${e.name}\` (${e.count})`).join("\n");
								if (str.length > 1024) return cutTags(str);
								else return str;
							}
							else return "-# null";
						})(),
					},
					{
						name: "Character",
						value: (()=>{
							if (data.tags.category.character.length) {
								const str = data.tags.category.character.map(e => `\`${e.name}\` (${e.count})`).join("\n");
								if (str.length > 1024) return cutTags(str);
								else return str;
							}
							else return "-# null";
						})(),
					},
					{
						name: "Artist",
						value: (()=>{
							if (data.tags.category.artist.length) {
								const str = data.tags.category.artist.map(e => `\`${e.name}\` (${e.count})`).join("\n");
								if (str.length > 1024) return cutTags(str);
								else return str;
							}
							else return "-# null";
						})()
					},
					{
						name: "General",
						value: (()=>{
							if (general)
								if (data.tags.category.general.length) {
									const str = data.tags.category.general.map(e => `\`${e.name}\` (${e.count})`).join("\n");
									if (str.length > 1024) return cutTags(str);
									else return str;
								}
								else return "-# null";
							else return `-# *${data.tags.category.general.length} tags*`;
						})(),
						inline: (() => {
							if (general) return false;
							else return true;
						})()
					},
					{
						name: "Meta",
						value: (()=>{
							if (data.tags.category.meta.length) {
								const str = data.tags.meta.map(e => `\`${e.name}\` (${e.count})`).join("\n");
								if (str.length > 1024) return cutTags(str);
								else return str;
							}
							else return "-# null";
						})(),
						inline: true
					}
				],
				image: {
					url: data.image.main.url
				}
			},
			buttons: {
				type: 1,
				components: [
					{
						type: 2,
						style: 2,
						label: "Prev",
						custom_id: "search:prev"
					},
					{
						type: 2,
						style: 2,
						label: "Next",
						custom_id: "search:next"
					}
				]
			}
		};

		if (data.tags.category.null.length) message.embed.fields.push({
			name: "null",
			value: (()=>{
				{
					const str = data.tags.category.null.map(e => `\`${e.name}\` (${e.count})`).join("\n");
					if (str.length > 1024) return cutTags(str);
					else return str;
				}
			})(),
			inline: true
		});

		return message;
	}
};

function definition(object) {
	return Object.entries(object)
	.map(def => `${ def[0] }: ${ def[1] }`).join("\n");
}

function cutTags(str) {
	const lines = str.split("\n");
	let text = [];
	let total = 0;
	for (let x = 0; x < lines.length; x++) {
		const line = lines[x];
		const length = line.length + 1;

		const remaining = lines.length - (x + 1);
		const final = remaining > 0 ? `\n- ${remaining} more tags...` : "";
		if (total + length + final.length > 1024) break;

		text.push(line);
		total += length;
	}
	const remaining = lines.length - text.length;
	text.push(`- ${remaining} more tags...`);
	return text.join("\n");
}

export default embed;