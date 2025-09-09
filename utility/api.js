async function post(id) {
	const { rule34 } = require("../config.json");
	const { DOMParser } = require("xmldom");
	const apiOrigin = "https://api.rule34.xxx//index.php?";
	const apiParams = new URLSearchParams({
		"page": "dapi",
		"s": "post",
		"q": "index",
		"id": id,
		"api_key": rule34.token,
		"user_id": "2373207"
	}).toString();
	const apiUrl = apiOrigin + apiParams;

	const api = {};

	api.json = await fetch(apiUrl+"&json=1&fields=tag_info")
		.then(e=>e.json()).then(e=>e[0]);

	api.xml = await fetch(apiUrl+"&json=0")
		.then(e=>e.text())
		.then(e=>new DOMParser().parseFromString(e, "text/xml"))
		.then(e=>{return {posts:e.firstChild,post:e.getElementsByTagName("post")[0]}});

	console.log(api.xml);

	const data = {
		image: {
			original: api.json.file_url,
			sample: api.json.sample ? api.json.sample_url : false,
			thumbnail: api.json.preview_url,
			size: {
				original: {
					width: api.json.width,
					height: api.json.height
				},
				sample: api.json.sample ? {
					width: api.json.sample_width,
					height: api.json.sample_height
				} : null,
				thumbnail: {
					width: Number(api.xml.post.getAttribute("preview_width")),
					height: Number(api.xml.post.getAttribute("preview_height"))
				}
			}
		},
		info: {
			post: {
				score: api.json.score,
				creator: {
					name: api.json.owner,
					id: Number(api.xml.post.getAttribute("creator_id"))
				},
				rating: api.json.rating,
				status: api.json.status,
				notes: api.json.has_notes,
				created: api.xml.post.getAttribute("created_at"),
				updated: (() => {
					const date = new Date(api.json.change * 1000);
					const localTime = new Date(date.getTime() * 1000);
				
					const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
					const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				
					const day = days[localTime.getUTCDay()];
					const month = months[localTime.getUTCMonth()];
					const dateNum = String(localTime.getUTCDate()).padStart(2, "0");
					const hours = String(localTime.getUTCHours()).padStart(2, "0");
					const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
					const seconds = String(localTime.getUTCSeconds()).padStart(2, "0");
					const year = localTime.getUTCFullYear();
				
					return `${day} ${month} ${dateNum} ${hours}:${minutes}:${seconds} ${year}`;
				})(),
				comments: api.json.comment_count
			},
			link: {
				parent: api.json.parent_id,
				children: api.xml.post.getAttribute("has_children")==="true" ? true : false,
				source: api.json.source ? api.json.source : false
			},
			file: {
				id: api.json.id,
				directory: api.json.directory,
				filename: api.json.image,
				hash: api.json.hash
			}
		},
		tags: {
			string: api.json.tags,
			list: api.json.tag_info,
			copyright: api.json.tag_info
				.filter(e=>e.type === "copyright")
				.map(e=>{return {name:e.tag,count:e.count};
			}),
			character: api.json.tag_info
				.filter(e=>e.type === "character")
				.map(e=>{return {name:e.tag,count:e.count};
			}),
			artist: api.json.tag_info
				.filter(e=>e.type === "artist")
				.map(e=>{return {name:e.tag,count:e.count};
			}),
			general: api.json.tag_info
				.filter(e=>e.type === "tag")
				.map(e=>{return {name:e.tag,count:e.count};
			}),
			meta: api.json.tag_info
				.filter(e=>e.type === "metadata")
				.map(e=>{return {name:e.tag,count:e.count};
			}),
			other: api.json.tag_info
				.filter(e=>
					e.type !== "copyright" &&
					e.type !== "character" &&
					e.type !== "artist" &&
					e.type !== "tag" &&
					e.type !== "metadata"
				)
				.map(e=>{return {name:e.tag,count:e.count,type:e.type};
			})
		}
	};

	return data;
}

async function search(query) {

}

module.exports.post = post;
module.exports.search = post;