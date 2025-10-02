import * as Discord from "discord.js";
const CT = Discord.ComponentType;
import emoji from "#util/emoji.json" with { type: "json" };
import { definition } from "#util/embed.js";
import inspect from "#command/booru/inspect/embed.js";

export default {
	create: (data, query, sort) => {
		const sortNum = {
			val: {
				"id": 0,
				"score": 1,
				"width": 2,
				"height": 3,
				"random": 4
			}[sort.val],
			dir: sort.val !== "random" ? {
				"desc": 0,
				"asc": 1
			}[sort.dir] : null
		};

		const params = `${query};${[sortNum.val, sortNum.dir].filter(e => e).join(";")}`;

		const message = { flags: Discord.MessageFlags.IsComponentsV2 };

		if (query.length > 74) message.components = [{ type: CT.Container,
			accent_color: 0xE9263D,
			components: [
				{ type: CT.TextDisplay, content: "### Query is over 74 characters!" },
				{ type: CT.TextDisplay, content:
					"Your query is too long to store in the ID of the appropriate buttons."
					+ "\nConsider shortening it or using the `/inspect` command."
				},
				{ type: CT.TextDisplay, content: `\`${query}\`` }
			]
		}];
		else message.components = [
			{ type: CT.Container, components: [
				{ type: CT.TextDisplay, content: `## ${query}` },
				{ type: CT.TextDisplay, content: `\`sort:${sort.val}:${sort.dir}\`` },
				{ type: CT.Separator,
					spacing: Discord.SeparatorSpacingSize.Small,
					divider: false
				},
				{ type: CT.TextDisplay, content:
					`### ${emoji.TC.h3.Artist} Artists\n`
					+ data.tags.category.Artist.map(tag => `\`${tag.name}\` (${tag.count})`).join("\n")
				},
				{ type: CT.File,
					file: { url: data.image.main.url } // TODO: see if this works
				},
				{ type: CT.ActionRow, components: [
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Save",
						custom_id: `booru/rake:stock?save;${data.id}`
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Pack",
						custom_id: `booru/rake:stock?pack;${data.id}`
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Knit",
						custom_id: `booru/rake:knit?${data.id}`
					},
					{ type: CT.Button,
						style: Discord.ButtonStyle.Secondary,
						label: "Inspect",
						custom_id: `booru/rake:info?${data.id}`
					}
				]}
			]},
			{ type: CT.ActionRow, components: [
				{ type: CT.Button,
					style: Discord.ButtonStyle.Secondary,
					label: "Prev",
					custom_id: "booru/rake:nav?prev"
				},
				{ type: CT.Button,
					style: Discord.ButtonStyle.Secondary,
					label: "Prev",
					custom_id: "booru/rake:nav?next"
				}
			]}
		];

		return message;
	}
};