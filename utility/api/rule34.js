import secrets from "#/secrets.json" with { type: "json" };
import { DOMParser } from "xmldom";

const post = async (query) => {
	console.time("Fetch post info");
	console.time("Format post info");

	const initial = await fetch(url.post({
		json: true, tags: true, query: query
	})).then(e => e.json().then(e => e[0])).catch(() => false);

	if (!initial) return null;

	const api = await Promise.all([
		fetch(url.post({
			limit: 1000, json: true, query: `parent:${initial.id}`
		})),
		fetch(url.post({
			json: false, query: query
		})),
		fetch(url.comment({
			id: initial.id
		}))
	]).then(async array => ({
		json: initial,
		children: await array[0].json(),
		xml: await array[1].text().then(e => new DOMParser().parseFromString(e, "text/xml")).then(e => ({
			posts: e.firstChild,
			post: e.getElementsByTagName("post")[0]
		})),
		comments: await array[2].text().then(e => new DOMParser().parseFromString(e, "text/xml")).then(e => Array.from(e.getElementsByTagName("comment")))
	}));
	console.timeEnd("Fetch post info");

	const data = formatData.main(api, { children: true, tags: true, comments: true });
	console.timeEnd("Format post info");

	return data;
};

const search = async (query, options) => {

};

const autocomplete = async (query) => {
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
};

const url = {
	post: (options) => {
		return "https://api.rule34.xxx/?" + new URLSearchParams({
			page: "dapi",
			s: "post",
			q: "index",
			limit: String(options.limit ?? 1),
			json: String(Number(options.json ?? false)),
			fields: options.tags ? "tag_info" : "",
			tags: options.query ?? "",
			api_key: secrets.rule34.token,
			user_id: "2373207"
		}).toString();
	},
	comment: (options) => {
		return "https://api.rule34.xxx/?" + new URLSearchParams({
			page: "dapi",
			s: "comment",
			q: "index",
			post_id: options.id,
			api_key: secrets.rule34.token,
			user_id: "2373207"
		}).toString();
	}
}

const formatData = {
	main: (api, config) => {
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
			children: config.children
				? api.children.filter(e => e.id !== api.json.id).map(e => e.id)
				: api.xml.post.getAttribute("has_children") === "true" ? true : false,
			source: api.json.source || null
		};

		if (config.tags) data.tags = {
			string: api.json.tags,
			array: api.json.tag_info
				.map(e => ({ name: e.tag, count: e.count, type: e.type })),
			category: {
				Copyright: api.json.tag_info
					.filter(e => e.type === "copyright")
					.map(e => ({ name: e.tag, count: e.count })),
				Character: api.json.tag_info
					.filter(e => e.type === "character")
					.map(e => ({ name: e.tag, count: e.count })),
				Artist: api.json.tag_info
					.filter(e => e.type === "artist")
					.map(e => ({ name: e.tag, count: e.count })),
				General: api.json.tag_info
					.filter(e => e.type === "tag")
					.map(e => ({ name: e.tag, count: e.count })),
				Metadata: api.json.tag_info
					.filter(e => e.type === "metadata")
					.map(e => ({ name: e.tag, count: e.count })),
				null: api.json.tag_info
					.filter(e => e.type === null)
					.map(e => ({ name: e.tag, count: e.count })),
				Other: api.json.tag_info
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

		if (config.comments) 
			data.comments = api.comments.map(e => ({
				creator: {
					name: e.getAttribute("creator"),
					id: Number(e.getAttribute("creator_id"))
				},
				id: Number(e.getAttribute("id")),
				body: e.getAttribute("body")
			}));

		return data;
	}
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

export default {
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
	 * @returns {Promise<Array<AutocompleteSuggestion>|null>} An array of
	 * objects with the top autocomplete suggestions, or `null` if the query
	 * ends in a space.
	 */
	autocomplete,

	/**
	 * @typedef {Object} ArrayTag
	 * @prop {string} name The name of the tag.
	 * @prop {number} count The amount of posts that use this tag.
	 * @prop {"copyright"|"character"|"artist"|"general"|"metadata"|null} type
	 * The category of this tag.
	 */
	/**
	 * @typedef {Object} CategoryTag
	 * @prop {string} name The name of the tag.
	 * @prop {number} count The amount of posts that use this tag.
	 *
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
	 * @prop {Object} image.main The original media.
	 * @prop {string} image.main.url The URL of the media file.
	 * @prop {number} image.main.width The width of the media in pixels.
	 * @prop {number} image.main.height The height of the media in pixels.
	 * @prop {Object} image.sample Downsampled image of the post's media,
	 * including if necessary.
	 * @prop {string} image.sample.url The URL of the media file.
	 * @prop {number} image.sample.width The width of the media in pixels.
	 * @prop {number} image.sample.height The height of the media in pixels.
	 * @prop {boolean} image.sample.necessary Whether the downsample is
	 * significant enough to be displayed in place of the original by default
	 * per Rule34.
	 * @prop {Object} image.thumbnail Downsampled version of the post's media,
	 * intended for use as a thumbnail.
	 * @prop {string} image.thumbnail.url The URL of the media file.
	 * @prop {number} image.thumbnail.width The width of the media in pixels.
	 * @prop {number} image.thumbnail.height The height of the media in pixels.
	 *
	 * @prop {number} image.directory The directory name of the file.
	 * @prop {string} image.name The filename, including the hash and file
	 * extension.
	 * @prop {string} image.hash The image's MD5 hash.
	 * @prop {string} image.extension The file extension.
	 *
	 * @prop {number} id The unique identifier of the post.
	 * @prop {Object} created The date of the post's creation.
	 * @prop {string} created.string The string representation of the date,
	 * accurate to the site.
	 * @prop {Date} created.date The date object representation.
	 * @prop {Object} updated The date of the post's latest update.
	 * @prop {string} updated.string The string representation of the date,
	 * accurate to the site.
	 * @prop {Date} updated.date The date object representation.
	 * @prop {Object} creator Info about the creator of the post.
	 * @prop {string} creator.name The creator's username.
	 * @prop {number} creator.id The creator's unique identifier.
	 * @prop {"questionable"|"explicit"} rating The suggestive rating of the
	 * post.
	 * @prop {number} score The total upvotes of the post.
	 * @prop {"active"|"flagged"|"deleted"} status The status of the post.
	 * @prop {boolean} notes Whether the post has notes attached.
	 * @prop {number|null} parent The ID of the post's parent, or `null` if not
	 * applicable.
	 * @prop {Array<number>} children An array of the post's children.
	 * @prop {string|null} source The source string, or `null` if none.
	 *
	 * @prop {Object} tags Info about the tags that label the post.
	 * @prop {string} tags.string A string of all tags organized alphabetically
	 * and separated by spaces.
	 * @prop {Array<ArrayTag>} tags.array An array of all tags organized
	 * alphabetically.
	 * @prop {Object} tags.category Arrays of all tags, categorized by their
	 * type.
	 * @prop {Array<CategoryTag>} tags.category.Copyright An array of all
	 * 'copyright' tags.
	 * @prop {Array<CategoryTag>} tags.category.Character An array of all
	 * 'character' tags.
	 * @prop {Array<CategoryTag>} tags.category.Artist An array of all 'artist'
	 * tags.
	 * @prop {Array<CategoryTag>} tags.category.General An array of all
	 * 'general' tags.
	 * @prop {Array<CategoryTag>} tags.category.Metadata An array of all
	 * 'metadata' tags.
	 * @prop {Array<CategoryTag>} tags.category.null An array of all `null`
	 * tags.
	 * @prop {Array<ArrayTag>} tags.category.Other An array of tags that don't
	 * fall under the known tag types. This should always be empty!
	 *
	 * @prop {Array<Comment>} comments An array of all comments under the post.
	 */
	/**
	 * Gets the first result from a query.
	 * [Cheatsheet](../info/rule34/cheatsheet.md) applies.
	 *
	 * @param {string} query Search query.
	 * @returns {Promise<Post|null>} An object with info such as post data,
	 * tags, and comments, or `null` if the query doesn't match any posts.
	 */
	post,

	search
};