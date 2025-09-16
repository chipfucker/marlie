const object = {
	infoEmbed: () => {},
	searchEmbed: (query, data, general) => {
		if (!data) {
			console.log("NO RESULTS THIS WAY");
			return {
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
			};
		}
		const message = {
			embed: {
				author: {
					name: query,
					url: `https://rule34.xxx/index.php?page=post&s=view&tags=${encodeURIComponent(query)}`
					// TODO: adjust link
				},
				title: `\`${data.info.file.id}\``,
				description: data.image.original,
				fields: [
					{
						name: "Copyright",
						value: (()=>{
							if (data.tags.copyright.length) {
								const str = data.tags.copyright.map(e => `\`${e.name}\` (${e.count})`).join("\n");
								if (str.length > 1024) return cutTags(str);
								else return str;
							}
							else return "-# null";
						})(),
					},
					{
						name: "Character",
						value: (()=>{
							if (data.tags.character.length) {
								const str = data.tags.character.map(e => `\`${e.name}\` (${e.count})`).join("\n");
								if (str.length > 1024) return cutTags(str);
								else return str;
							}
							else return "-# null";
						})(),
					},
					{
						name: "Artist",
						value: (()=>{
							if (data.tags.artist.length) {
								const str = data.tags.artist.map(e => `\`${e.name}\` (${e.count})`).join("\n");
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
								if (data.tags.general.length) {
									const str = data.tags.general.map(e => `\`${e.name}\` (${e.count})`).join("\n");
									if (str.length > 1024) return cutTags(str);
									else return str;
								}
								else return "-# null";
							else return `-# *${data.tags.general.length} tags*`;
						})(),
						inline: (() => {
							if (general) return false;
							else return true;
						})()
					},
					{
						name: "Meta",
						value: (()=>{
							if (data.tags.meta.length) {
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
					url: data.image.original
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

		if (data.tags.other.length) message.embed.fields.push({
			name: "Other (null)",
			value: (()=>{
				{
					const str = data.tags.other.map(e => `\`${e.name}\` (${e.count})`).join("\n");
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