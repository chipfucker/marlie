const { searchEmbed } = require("./embed");
const { post } = require("./rule34api");

const object = async i => {
	const type = i.customId.split(":").shift();
	const action = i.customId.split(":").pop();
	switch (type) {
		case "search": {
			if (action === "prev" || action === "next") {
				await i.update({ components: [{
					type: 1,
					components: [{
						type: 2,
						style: 2,
						disabled: true,
						custom_id: "loading",
						label: "Loading...",
					}]
				}]});

				const messageJson = i.message.content.replace(
					/\|\|```json\n(.*)\n```\|\|/, "$1");
				const json = JSON.parse(messageJson);

				var data;
				if (action === "prev") {
					const comparison = (json.sort.dir==="desc") ? ">" : "<";
					const direction = (json.sort.dir==="desc") ? "asc" : "desc";
					const query = `${json.query} ${json.sort.val}:${comparison}${json.value} sort:${json.sort.val}:${direction}`;
					data = await post(query);
				} else if (action === "next") {
					const comparison = (json.sort.dir==="desc") ? "<" : ">";
					const direction = json.sort.dir;
					const query = `${json.query} ${json.sort.val}:${comparison}${json.value} sort:${json.sort.val}:${direction}`;
					data = await post(query);
				}

				if (!data) {
					await i.followUp({ content: "No more results this way!", flags: 64 });

					const message = searchEmbed(null, false);
					i.editReply({
						components: [message]
					});
					return;
				}
				
				const messageData = {
					query: json.query,
					sort: json.sort,
					value: (() => {
						switch (json.sort.val) {
							case "width": return data.image.size.original.width;
							case "height": return data.image.size.original.height;
							case "id": return data.info.file.id;
							case "score": return data.info.post.score;
							default: return 0;
						}
					})(),
					general: json.general
				};
		
				const message = searchEmbed(json.query, data, json.general);
		
				i.editReply({
					content: `||\`\`\`json\n${JSON.stringify(messageData)}\n\`\`\`||`,
					embeds: [message.embed],
					components: [message.buttons]
				});
			} else switch (action) {
				case "pack": {
					// some more code
				} break;
				case "save": {
					// some more code
				} break;
			}
		} break;
		case "showoff": {
			if (action === "prev" || action === "next") {
				const originalMessage = i.message.content.replace(
					/(-# \[Data URL\]\(https:\/\/data\?.* "Ignore this!"\)\n:mag_right: .*\n).*/
				, "$1");
				await i.update({ components: [], content: `${originalMessage}### Loading...` });

				const messageJson = i.message.content.replace(
					/-# \[Data URL\]\(https:\/\/data\?(.*) "Ignore this!"\).*/s
				, "$1");
				const json = JSON.parse(messageJson);

				var data;
				if (action === "prev") {
					const comparison = (json.sort.dir==="desc") ? ">" : "<";
					const direction = (json.sort.dir==="desc") ? "asc" : "desc";
					const query = `${json.query} ${json.sort.val}:${comparison}${json.value} sort:${json.sort.val}:${direction}`;
					data = await post(query);
				} else if (action === "next") {
					const comparison = (json.sort.dir==="desc") ? "<" : ">";
					const direction = json.sort.dir;
					const query = `${json.query} ${json.sort.val}:${comparison}${json.value} sort:${json.sort.val}:${direction}`;
					data = await post(query);
				}

				if (!data) {
					await i.followUp({ content: "No more results this way!", flags: 64 });

					const message = searchEmbed(null, false);
					i.editReply({
						components: [message]
					});
					return;
				}
				
				const messageData = {
					query: json.query,
					sort: json.sort,
					value: (() => {
						switch (json.sort.val) {
							case "width": return data.image.size.original.width;
							case "height": return data.image.size.original.height;
							case "id": return data.info.file.id;
							case "score": return data.info.post.score;
							default: return 0;
						}
					})()
				};
		
				i.editReply({
					content: `-# [Data URL](https://data?${JSON.stringify(messageData)} "Ignore this!")\n`
						+ `:mag_right: ${json.query}\n[Image](${data.image.original}?${data.info.file.id})`,
					components: [{
						type: 1,
						components: [
							{
								type: 2,
								style: 2,
								label: "Prev",
								custom_id: "showoff:prev"
							},
							{
								type: 2,
								style: 2,
								label: "Next",
								custom_id: "showoff:next"
							}
						]
					}]
				});
			} else switch (action) {
				case "pack": {
					// some more code
				} break;
				case "save": {
					// some more code
				} break;
			}
		} break;
		case "thread": switch (action) {
			case "next": {
				// some more code
			} break;
			case "like": {
				// some more code
			} break;
			case "unlike": {
				// some more code
			} break;
			case "pack": {
				// some more code
			} break;
			case "save": {
				// some more code
			} break;
		} break;
	}
};

module.exports = object;