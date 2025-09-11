const object = {
	post: async (query) => {
		const { rule34 } = require("../config.json");
		const { DOMParser } = require("xmldom");
		const apiUrl = (obj) => {
			if (obj.type === "post")
				return "https://api.rule34.xxx//index.php?"+new URLSearchParams({
					page: "dapi",
					s: "post",
					q: "index",
					limit: "1",
					json: String(Number(obj.json)),
					fields: obj.json ? "tag_info" : "",
					tags: obj.query,
					api_key: rule34.token,
					user_id: "2373207"
				}).toString();
			else if (obj.type === "comment")
				return "https://api.rule34.xxx//index.php?"+new URLSearchParams({
					page: "dapi",
					s: "comment",
					q: "index",
					post_id: obj.id,
					api_key: rule34.token,
					user_id: "2373207"
				}).toString();
		};

		const api = {};

		api.json = await fetch(apiUrl({
			type:"post", json: true, query: query
		})).then(e=>e.json()).then(e=>e[0]).catch(() => false);

		if (!api.json) return false;

		api.xml = await fetch(apiUrl({
			type: "post", json: false, query: query
		})).then(e=>e.text())
			.then(e=>new DOMParser().parseFromString(e, "text/xml"))
			.then(e=>{return {posts:e.firstChild,post:e.getElementsByTagName("post")[0]}});
		
		api.comments = await fetch(apiUrl({
			type: "comment", id: api.json.id
		})).then(e=>e.text())
			.then(e=>new DOMParser().parseFromString(e, "text/xml"))
			.then(e=>Array.from(e.getElementsByTagName("comment")));

		const data = {
			image: {
				original: api.json.file_url,
				sample_bool: api.json.sample,
				sample: api.json.sample_url,
				thumbnail: api.json.preview_url,
				size: {
					original: {
						width: api.json.width,
						height: api.json.height
					},
					sample: api.json.sample ? {
						width: api.json.sample_width,
						height: api.json.sample_height
					} : false,
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
					parent: api.json.parent_id || false,
					children: api.xml.post.getAttribute("has_children") === "true" ? true : false,
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
					.map(e=>({name:e.tag,count:e.count})),
				character: api.json.tag_info
					.filter(e=>e.type === "character")
					.map(e=>({name:e.tag,count:e.count})),
				artist: api.json.tag_info
					.filter(e=>e.type === "artist")
					.map(e=>({name:e.tag,count:e.count})),
				general: api.json.tag_info
					.filter(e=>e.type === "tag")
					.map(e=>({name:e.tag,count:e.count})),
				meta: api.json.tag_info
					.filter(e=>e.type === "metadata")
					.map(e=>({name:e.tag,count:e.count})),
				other: api.json.tag_info
					.filter(e=>
						e.type !== "copyright" &&
						e.type !== "character" &&
						e.type !== "artist" &&
						e.type !== "tag" &&
						e.type !== "metadata"
					)
					.map(e=>({name:e.tag,count:e.count,type:e.type}))
			},
			comments: api.comments.map(e=>({
				creator: {
					name: e.getAttribute("creator"),
					id: Number(e.getAttribute("creator_id"))
				},
				id: Number(e.getAttribute("id")),
				content: e.getAttribute("body")
			}))
		};

		return data;
	},
	search: async (query) => {
		const { rule34 } = require("../config.json");
		const { DOMParser } = require("xmldom");
		const apiOrigin = "https://api.rule34.xxx//index.php?";
		const apiParams = new URLSearchParams({
			page: "dapi",
			s: "post",
			q: "index",
			limit: "1",
			tags: query,
			api_key: rule34.token,
			user_id: "2373207"
		}).toString();
		const apiUrl = apiOrigin + apiParams;

		const api = {};

		api.json = await fetch(apiUrl+"&json=1&fields=tag_info")
			.then(e=>e.json()).then(e=>e[0]);

		api.xml = await fetch(apiUrl+"&json=0")
			.then(e=>e.text())
			.then(e=>new DOMParser().parseFromString(e, "text/xml"))
			.then(e=>{return {posts:e.firstChild,post:e.getElementsByTagName("post")[0]}});
		
		api.comments = await fetch(apiOrigin+new URLSearchParams({
			page: "dapi",
			s: "comment",
			q: "index",
			post_id: api.json.id,
			api_key: rule34.token,
			user_id: "2373207"
		}))
			.then(e=>e.text())
			.then(e=>new DOMParser().parseFromString(e, "text/xml"))
			.then(e=>Array.from(e.getElementsByTagName("comment")));

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
					} : false,
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
					parent: api.json.parent_id ? true : false,
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
					.map(e=>({name:e.tag,count:e.count})),
				character: api.json.tag_info
					.filter(e=>e.type === "character")
					.map(e=>({name:e.tag,count:e.count})),
				artist: api.json.tag_info
					.filter(e=>e.type === "artist")
					.map(e=>({name:e.tag,count:e.count})),
				general: api.json.tag_info
					.filter(e=>e.type === "tag")
					.map(e=>({name:e.tag,count:e.count})),
				meta: api.json.tag_info
					.filter(e=>e.type === "metadata")
					.map(e=>({name:e.tag,count:e.count})),
				other: api.json.tag_info
					.filter(e=>
						e.type !== "copyright" &&
						e.type !== "character" &&
						e.type !== "artist" &&
						e.type !== "tag" &&
						e.type !== "metadata"
					)
					.map(e=>({name:e.tag,count:e.count,type:e.type}))
			},
			comments: api.comments.map(e=>({
				creator: {
					name: e.getAttribute("creator"),
					id: Number(e.getAttribute("creator_id"))
				},
				id: Number(e.getAttribute("id")),
				content: e.getAttribute("body")
			}))
		};

		return data;
	},

	search: async (query) => {

	}
};

module.exports = object;