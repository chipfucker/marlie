import * as Discord from "discord.js";
const CT = Discord.ComponentType;
import emoji from "#util/emoji.json" with { type: "json" };

export default {
	create: (data, query, sort) => {
		if (sort.val === "random") sort = false;
		else {
			sort.name = {
				"id": "ID",
				"score": "Score",
				"width": "Width",
				"height": "Height"
			}[sort.val];
			sort.num = {
				"id": data.id,
				"score": data.score,
				"width": data.image.main.width,
				"height": data.image.main.height
			}[sort.val];
		}

		const message = { flags: Discord.MessageFlags.IsComponentsV2, components: [
			{ type: CT.Container, components: [
				{ type: CT.TextDisplay, content: `## \`${query}\` (${sort.val}:${sort.dir})` },
				sort && { type: CT.TextDisplay, content: `### ${sort.name}: ${sort.num}`},
				{ type: CT.Separator,
					spacing: Discord.SeparatorSpacingSize.Small,
					divider: false
				},
				{ type: CT.TextDisplay, content:
					`### ${emoji.TC.h3.Artist} Artists\n`
					+ data.tags.category.Artist.map(tag => `\`${tag.name}\` (${tag.count})`).join("\n")
				},
				{ type: CT.MediaGallery, items: [{
					media: { url: data.image.main.url }
				}]},
				{ type: CT.ActionRow, components: [
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Save",
						custom_id: `booru/sift:stock?save;${data.id}`
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Pack",
						custom_id: `booru/sift:stock?pack;${data.id}`
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Knit",
						custom_id: `booru/sift:knit?${data.id}`
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Inspect",
						custom_id: `booru/sift:info?${data.id}`
					}
				]}
			].filter(e => e)},
			{ type: CT.ActionRow, components: [
				sort && { type: CT.Button,
					style: Discord.ButtonStyle.Secondary,
					label: "Prev",
					emoji: { name: "⬅️" },
					custom_id: "booru/sift:nav?prev"
				},
				{ type: CT.Button,
					style: Discord.ButtonStyle.Secondary,
					label: "Next",
					emoji: { name: "➡️" },
					custom_id: "booru/sift:nav?next"
				}
			].filter(e => e)}
		]};

		return message;
	}
};