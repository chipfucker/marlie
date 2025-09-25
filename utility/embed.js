// TODO: rename members without 'embed'
const object = {
	showoff: () => {},
	infoEmbed: () => {},
	searchEmbed: (query, data, general) => {
		const message = {
			embed: {
				author: {
					name: query,
					url: `https://rule34.xxx/index.php?page=post&s=view&tags=${encodeURIComponent(query)}`
					// TODO: adjust link
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

module.exports = object;