import * as Discord from "discord.js";
const CT = Discord.ComponentType;
import emoji from "#util/emoji.json" with { type: "json" };
import { definition } from "#util/embed.js";

export default {
	create: (query, data) => {
		const message = {
			flags: Discord.MessageFlags.IsComponentsV2,
			components: [{ type: CT.Container, components: [
				{ type: CT.Section,
					components: [
						{ type: CT.TextDisplay, content: `First result of \`${query}\`` },
						{ type: CT.TextDisplay, content: `## ${data.id}`, },
						{ type: CT.TextDisplay,
							content: Object.entries({
								"Search URL": `https://rule34.xxx/?page=post&s=list&tags=${encodeURIComponent(query)}`,
								"Post URL": `https://rule34.xxx/?page=post&s=view&id=${data.id}`,
								"Image URL": data.image.main.url
							}).map(def => `[${ def[0] }](${ def[1] })`).join("\n")
						}
					],
					accessory: { type: CT.Thumbnail,
						media: { url: data.image.thumbnail.url }
					}
				},
				{ type: CT.Separator,
					divider: true,
					spacing: Discord.SeparatorSpacingSize.Large
				},
				{ type: CT.TextDisplay,
					content: definition({
						"Creator": `\`${data.creator.name}\``,
						"Score": `${data.score}`
					})
				},
				{ type: CT.Separator,
					divider: false,
					spacing: Discord.SeparatorSpacingSize.Small
				},
				{ type: CT.TextDisplay,
					content: definition({
						"Created": data.created.string,
						"Updated": data.updated.string
					})
				},
				{ type: CT.Separator,
					divider: false,
					spacing: Discord.SeparatorSpacingSize.Small
				},
				{ type: CT.TextDisplay,
					content: definition({
						"Source": data.source ?? "none",
						"Parent": data.parent ? `\`${data.parent}\`` : "none",
						"Children": data.children.length
							? data.children.map(id => `${emoji.indent}\`${id}\``).join("\n")
							: "none"
					})
				},
				{ type: CT.Separator,
					divider: false,
					spacing: Discord.SeparatorSpacingSize.Small
				},
				{ type: CT.TextDisplay,
					content: definition({
						"Directory": data.image.directory,
						"Hash": data.image.hash
					})
				}
			]}]
		};

		if (data.tags.array.length) {
			message.components[0].components.push({
				type: CT.Separator,
				divider: true,
				spacing: Discord.SeparatorSpacingSize.Large
			});

			for (const [name, tags] of Object.entries(data.tags.category)) {
				if (tags.length) {
					if (name === "General") message.components[0].components.push(
						{ type: CT.TextDisplay, content: `### ${emoji.TC.h3[name]} ${name}` },
						{ type: CT.ActionRow, components: [{
							type: CT.Button,
							style: Discord.ButtonStyle.Secondary,
							label: `${tags.length} tags`,
							custom_id: "booru/inspect:general/show"
						}]}
					);
					
					else message.components[0].components.push({
						type: CT.TextDisplay,
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
			type: CT.ActionRow,
			components: [{ type: CT.Button,
				style: Discord.ButtonStyle.Secondary,
				label: `${data.comments.length} comment${data.comments.length === 1 ? "" : "s"}`,
				custom_id: "booru/inspect:comments/toggle?show"
			}]
		});

		return message;
	},
	general: {
		shown: ({ tags: { category: { General: tags }}}) => {
			const components = [
				{ type: CT.TextDisplay,
					content: `### ${emoji.TC.h3.General} General\n${tags.map(tag =>
						`\`${tag.name}\` (${tag.count})`
					).join("\n")}`
				},
				{ type: CT.ActionRow, components: [{
					type: CT.Button,
					style: Discord.ButtonStyle.Primary,
					label: "Hide tags",
					custom_id: "booru/inspect:general/hide"
				}]}
			];
			return components;
		},
		hidden: ({ tags: { category: { General: tags }}}) => {
			const components = [
				{ type: CT.TextDisplay,
					content: `### ${emoji.TC.h3.General} General`
				},
				{ type: CT.ActionRow, components: [{
					type: CT.Button,
					style: Discord.ButtonStyle.Secondary,
					label: `${tags.length} tags`,
					custom_id: "booru/inspect:general/show"
				}]}
			];
			return components;
		},
		regex: new RegExp(`### ${emoji.TC.h3.General} General`)
	},
	comments: {
		shown: ({ comments }, page) => {
			const items = 5;
			const index = page * items;
			const endIndex = index + items;
			const component = { type: CT.Container, components: [
				{ type: CT.TextDisplay,
					content: comments.slice(index, endIndex).map(comment =>
						`**${comment.creator.name}** \u00BB #${comment.id}\n${comment.body.trim()}`
					).join("\n\n")
				},
				{ type: CT.TextDisplay,
					content: `Page ${page + 1} / ${Math.ceil(comments.length / items)}`
				},
				{ type: CT.ActionRow, components: [
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Prev",
						custom_id: "booru/inspect:comments/nav?prev",
						disabled: page === 0
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Next",
						custom_id: "booru/inspect:comments/nav?next",
						disabled: endIndex >= comments.length
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Success,
						label: "Post",
						custom_id: "booru/inspect:comments/post"
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Primary,
						label: "Hide",
						custom_id: "booru/inspect:comments/toggle?hide"
					}
				]}
			]};
			return component;
		},
		hidden: ({ comments }) => {
			const component = { type: CT.ActionRow, components: [{
				type: CT.Button,
				style: Discord.ButtonStyle.Secondary,
				label: `${comments.length} comment${comments.length === 1 ? "" : "s"}`,
				custom_id: "booru/inspect:comments/toggle?show"
			}]};
			return component;
		},
		post: (id) => {
			const modal = {
				title: `Comment on post ${id}`,
				custom_id: "booru/inspect:comments/post",
				components: [{
					type: CT.ActionRow,
					components: [{
						type: CT.TextInput,
						custom_id: "content",
						label: "Content",
						placeholder: "At least 3 words!",
						style: Discord.TextInputStyle.Paragraph
					}]
				}]
			};
			return modal;
		}
	}
};