const object = {
	infoEmbed: () => {},
	searchEmbed: (query, data, general) => {
		const message = {
			embed: {
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
							else return "-# null";
						})(),
					},
					{
						name: "Character",
						value: (()=>{
							if (data.tags.character.length)
								return data.tags.character.map(e => `\`${e.name}\` (${e.count})`).join("\n");
							else return "-# null";
						})(),
					},
					{
						name: "Artist",
						value: (()=>{
							if (data.tags.artist.length)
								return data.tags.artist.map(e => `\`${e.name}\` (${e.count})`).join("\n");
							else return "-# null";
						})()
					},
					{
						name: "General",
						value: (()=>{
							if (general)
								if (data.tags.general.length)
									return data.tags.general.map(e => `\`${e.name}\` (${e.count})`).join("\n");
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
							if (data.tags.meta.length)
								return data.tags.meta.map(e => `\`${e.name}\` (${e.count})`).join("\n");
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
						custom_id: "search_prev"
					},
					{
						type: 2,
						style: 2,
						label: "Next",
						custom_id: "search_next"
					}
				]
			}
		};

		if (data.tags.other.length) message.embed.fields.push({
			name: "Other (null)",
			value: (()=> data.tags.other
				.map(e => `\`${e.name}\` (${e.count}) TYPE: ${e.type}`).join("\n")
			)(),
			inline: true
		});

		return message;
	}
};

module.exports = object;