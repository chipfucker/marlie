import * as Discord from "discord.js";
import emoji from "#util/emoji.json" with { type: "json" };
import { definition } from "#util/embed.js";

export default {
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
							content: `### ${emoji.TC.h3[name]} ${name}`
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
						content: `### ${emoji.TC.h3[name]} ${name}\n${ (() => {
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
			type: Discord.ComponentType.ActionRow,
			components: [{
				type: Discord.ComponentType.Button,
				style: Discord.ButtonStyle.Secondary,
				label: `${data.comments.length} comment${data.comments.length === 1 ? "" : "s"}`,
				custom_id: "inspect:comments:show"
			}]
		});

		return message;
	},
	general: {
		shown: ({ tags: { category: { General: tags }}}) => {
			const components = [
				{
					type: Discord.ComponentType.TextDisplay,
					content: `### ${emoji.TC.h3.General} General\n${tags.map(tag =>
						`\`${tag.name}\` (${tag.count})`
					).join("\n")}`
				},
				{
					type: Discord.ComponentType.ActionRow,
					components: [{
						type: Discord.ComponentType.Button,
						style: Discord.ButtonStyle.Primary,
						label: "Hide tags",
						custom_id: "inspect:general:hide"
					}]
				}
			];
			return components;
		},
		hidden: ({ tags: { category: { General: tags }}}) => {
			const components = [
				{
					type: Discord.ComponentType.TextDisplay,
					content: `### ${emoji.TC.h3.General} General`
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
			];
			return components;
		}
	},
	comments: {
		shown: ({ comments }, page) => {
			const items = 5;
			const index = page * items;
			const endIndex = index + items;
			const components = [
				{
					type: Discord.ComponentType.TextDisplay,
					content: comments.slice(index, endIndex).map(comment =>
						`**${comment.creator.name}** \u00BB #${comment.id}\n${comment.body}`
					).join("\n\n")
				},
				{
					type: Discord.ComponentType.TextDisplay,
					content: `Page ${page + 1} / ${Math.ceil(comments.length / items)}`
				},
				{
					type: Discord.ComponentType.ActionRow,
					components: [
						{
							type: Discord.ComponentType.Button,
							style: Discord.ButtonStyle.Secondary,
							label: "Prev",
							custom_id: "inspect:comments:prev",
							disabled: page === 0
						},
						{
							type: Discord.ComponentType.Button,
							style: Discord.ButtonStyle.Secondary,
							label: "Next",
							custom_id: "inspect:comments:next",
							disabled: endIndex >= comments.length
						},
						{
							type: Discord.ComponentType.Button,
							style: Discord.ButtonStyle.Primary,
							label: "Hide comments",
							custom_id: "inspect:comments:hide"
						}
					]
				}
			];
			return components;
		},
		hidden: ({ comments }) => {
			const component = {
				type: Discord.ComponentType.ActionRow,
				components: [{
					type: Discord.ComponentType.Button,
					style: Discord.ButtonStyle.Secondary,
					label: `${comments.length} comment${comments.length === 1 ? "" : "s"}`,
					custom_id: "inspect:comments:show"
				}]
			};
			return component;
		}
	}
};