const { rule34 } = require("../config.json");
const { DOMParser } = require("xmldom");

const post = async (query) => {

	const api = {};

	api.json = await fetch(apiUrl.post({
		json: true, query: query
	})).then(e => e.json()).then(e => e[0]).catch(() => false);

	if (!api.json) return null;

	// api.children = await fetch(apiUrl.post({
	// 	type: ""
	// }))

	api.xml = await fetch(apiUrl.post({
		json: false, query: query
	})).then(e => e.text())
		.then(e => new DOMParser().parseFromString(e, "text/xml"))
		.then(e => { return { posts: e.firstChild, post: e.getElementsByTagName("post")[0] }});
	
	api.comments = await fetch(apiUrl.comment({
		id: api.json.id
	})).then(e=>e.text())
		.then(e=>new DOMParser().parseFromString(e, "text/xml"))
		.then(e=>Array.from(e.getElementsByTagName("comment")));

	const data = dataObject(api);
	data.comments = api.comments.map(e => ({
		creator: {
			name: e.getAttribute("creator"),
			id: Number(e.getAttribute("creator_id"))
		},
		id: Number(e.getAttribute("id")),
		body: e.getAttribute("body")
	}));

	data.tags = {
		string: api.json.tags,
		// TODO: reformat tags to match jsdoc
		array: api.json.tag_info,
		categories: {
			copyright: api.json.tag_info
				.filter(e => e.type === "copyright")
				.map(e => ({ name: e.tag, count: e.count })),
			character: api.json.tag_info
				.filter(e => e.type === "character")
				.map(e => ({ name: e.tag, count: e.count })),
			artist: api.json.tag_info
				.filter(e => e.type === "artist")
				.map(e => ({ name: e.tag, count: e.count })),
			general: api.json.tag_info
				.filter(e => e.type === "tag")
				.map(e => ({ name: e.tag, count: e.count })),
			metadata: api.json.tag_info
				.filter(e => e.type === "metadata")
				.map(e => ({ name: e.tag, count: e.count })),
			null: api.json.tag_info
				.filter(e => e.type === null)
				.map(e => ({ name: e.tag, count: e.count })),
			other: api.json.tag_info
				.filter(e => ![
					"copyright",
					"character",
					"artist",
					"tag",
					"metadata",
					null
				].includes(e.type))
				.map(e => ({ name: e.tag, count: e.count, type: e.type }))
		}
	};
	// old data
	/* const data = {
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
				sample: {
					width: api.json.sample_width,
					height: api.json.sample_height
				},
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
				created: new Date(api.xml.post.getAttribute("created_at")),
				updated: new Date(api.json.change * 1000),
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
				hash: api.json.hash,
				extension: api.json.image.split(".").pop()
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
	}; */

	return data;
};

const search = async (query, options) => {

};

const apiUrl = {
	post: (options) => {
		return "https://api.rule34.xxx/?" + new URLSearchParams({
			page: "dapi",
			s: "post",
			q: "index",
			limit: options.limit ?? "1",
			json: String(Number(options.json ?? false)),
			fields: options.json ? "tag_info" : "",
			tags: options.query ?? "",
			api_key: rule34.token,
			user_id: "2373207"
		}).toString();
	},
	comment: (options) => {
		return "https://api.rule34.xxx/?" + new URLSearchParams({
			page: "dapi",
			s: "comment",
			q: "index",
			post_id: options.id,
			api_key: rule34.token,
			user_id: "2373207"
		}).toString();
	}
}

function dataObject(api) {
	const data = {
		image: {
			main: {
				url: api.json.file_url,
				width: api.json.width,
				height: api.json.height
			},
			sample: {
				url: api.json.sample_url,
				width: api.json.sample_width,
				height: api.json.sample_height,
				necessary: api.json.sample
			},
			thumbnail: {
				url: api.json.preview_url,
				width: Number(api.xml.post.getAttribute("preview_width")),
				height: Number(api.xml.post.getAttribute("preview_height"))
			},
			directory: api.json.directory,
			name: api.json.image,
			hash: api.json.hash,
			extension: api.json.image.split(".").pop()
		},
		id: api.json.id,
		created: dateObject(new Date(api.xml.post.getAttribute("created_at"))),
		updated: dateObject(new Date(api.json.change * 1000)),
		creator: {
			name: api.json.owner,
			id: Number(api.xml.post.getAttribute("creator_id"))
		},
		rating: api.json.rating,
		score: api.json.score,
		status: api.json.status,
		notes: api.json.has_notes, // TODO: find out how to fetch note info
		parent: api.json.parent_id, // TODO: find out how null parents are handled in the site
		children: api.xml.post.getAttribute("has_children") === "true", // TODO: convert to array of children
		source: api.json.source || null
	};

	return data;
}

function dateObject(object) {
	const day = [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
	][object.getDay()];
	const month = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	][object.getMonth()];
	const date = String(object.getDate()).padStart(2, "0");

	const hour = String(object.getHours()).padStart(2, "0");
	const minute = String(object.getMinutes()).padStart(2, "0");
	const second = String(object.getSeconds()).padStart(2, "0");

	const zone = (() => {
		const zone = object.getTimezoneOffset();
		const pos = zone >= 0 ? "+" : "-";
		const num = String(Math.abs(zone)).padStart(4, "0");
		return pos + num;
	})();
	const year = String(object.getFullYear());

	return {
		string: `${day} ${month} ${date} ${hour}:${minute}:${second} ${zone} ${year}`,
		date: object
	};
}

// TODO: nest objects in r34 object
const object = {
	/**
	 * @typedef {Object} AutocompleteSuggestion
	 * @property {string} tag The full suggested tag.
	 * @property {string} query The full query including the suggested tag in
	 * place of the incomplete tag.
	 * @property {number} count The amount of posts that use this tag.
	 */

	/**
	 * Gets the top autocomplete suggestions for an incomplete tag.
	 *
	 * Multiple tags are supported, and the last tag is used to determine the
	 * autocomplete results.
	 *
	 * @param {string} query Full query.
	 * @returns {Promise<Array<AutocompleteSuggestion>|null>} An array of objects with
	 * the top autocomplete suggestions, or `null` if the query ends in a space.
	 */

	autocomplete: async (query) => {
		const arr = query.split(" ");
		const tag = arr.pop();
		if (!tag) return null;
		const rest = arr.join(" ");
		const results = await fetch(
			"https://api.rule34.xxx/autocomplete.php?q=" + encodeURIComponent(tag)
		).then(e=>e.json());
		const data = results.map(obj => ({
			tag: obj.value,
			query: `${rest} ${obj.value}`.trim(),
			count: Number(obj.label.replace(/.* \((\d*)\)/, "$1"))
		}));
		return data;
	},
	
	/**
	 * @typedef {Object} ArrayTag
	 * @prop {string} name The name of the tag.
	 * @prop {number} count The amount of posts that use this tag.
	 * @prop {"copyright"|"character"|"artist"|"general"|"metadata"|null} type The category of this tag.
	 */

	/**
	 * @typedef {Object} CategoryTag
	 * @prop {string} name The name of the tag.
	 * @prop {number} count The amount of posts that use this tag.
	 */

	/**
	 * @typedef {Object} Comment
	 * @prop {Object} creator Info about the commenter.
	 * @prop {string} creator.name The commenter's username.
	 * @prop {number} creator.id The commenter's unique identifier.
	 * @prop {number} id The comment's unique identifier.
	 * @prop {string} content The comment's body.
	 */

	/**
	 * @typedef {Object} Post
	 * 
	 * @prop {Object} image Info about the media of the post.
	 * 
	 * @prop {Object} image.main The original media.
	 * @prop {string} image.main.url The URL of the media file.
	 * @prop {number} image.main.width The width of the media in pixels.
	 * @prop {number} image.main.height The height of the media in pixels.
	 * @prop {Object} image.sample Downsampled image of the post's media, including if necessary.
	 * @prop {string} image.sample.url The URL of the media file.
	 * @prop {number} image.sample.width The width of the media in pixels.
	 * @prop {number} image.sample.height The height of the media in pixels.
	 * @prop {boolean} image.sample.necessary Whether the downsample is significant enough to be displayed in place of the original by default per Rule34.
	 * @prop {Object} image.thumbnail Downsampled version of the post's media, intended for use as a thumbnail.
	 * @prop {string} image.thumbnail.url The URL of the media file.
	 * @prop {number} image.thumbnail.width The width of the media in pixels.
	 * @prop {number} image.thumbnail.height The height of the media in pixels.
	 * 
	 * @prop {number} image.directory The directory name of the file.
	 * @prop {string} image.name The filename, including the hash and file extension.
	 * @prop {string} image.hash The image's MD5 hash.
	 * @prop {string} image.extension The file extension.
	 * 
	 * @prop {number} id The unique identifier of the post.
	 * @prop {Object} created The date of the post's creation.
	 * @prop {string} created.string The string representation of the date, accurate to the site.
	 * @prop {Date} created.date The date object representation.
	 * @prop {Object} updated The date of the post's latest update.
	 * @prop {string} updated.string The string representation of the date, accurate to the site.
	 * @prop {Date} updated.date The date object representation.
	 * @prop {Object} creator Info about the creator of the post.
	 * @prop {string} creator.name The creator's username.
	 * @prop {number} creator.id The creator's unique identifier.
	 * @prop {"questionable"|"explicit"} rating The suggestive rating of the post.
	 * @prop {number} score The total upvotes of the post.
	 * @prop {"active"|"flagged"|"deleted"} status The status of the post.
	 * @prop {boolean} notes Whether the post has notes attached.
	 * @prop {number|null} parent The ID of the post's parent, or `null` if not applicable.
	 * @prop {Array<number>} children An array of the post's children.
	 * @prop {string|null} source The source string, or `null` if none.
	 * 
	 * @prop {Object} tags Info about the tags that label the post.
	 * @prop {string} tags.string A string of all tags organized alphabetically and separated by spaces.
	 * @prop {Array<ArrayTag>} tags.array An array of all tags organized alphabetically.
	 * @prop {Object} tags.categories Arrays of all tags, categorized by their type.
	 * @prop {Array<CategoryTag>} tags.categories.copyright An array of all 'copyright' tags.
	 * @prop {Array<CategoryTag>} tags.categories.character An array of all 'character' tags.
	 * @prop {Array<CategoryTag>} tags.categories.artist An array of all 'artist' tags.
	 * @prop {Array<CategoryTag>} tags.categories.general An array of all 'general' tags.
	 * @prop {Array<CategoryTag>} tags.categories.metadata An array of all 'metadata' tags.
	 * @prop {Array<CategoryTag>} tags.categories.null An array of all `null` tags.
	 * 
	 * @prop {Array<Comment>} comments An array of all comments under the post.
	 */

	/**
	 * Gets the first result from a query.
	 * [Cheatsheet](../info/rule34/cheatsheet.md) applies.
	 *
	 * @param {string} query Search query.
	 * @returns {Promise<Post|null>} An object with info such as post data, tags, and
	 * comments, or `null` if the query doesn't match any posts.
	 */

	post: post,

	search: async (query) => {

	}
};

module.exports = object;