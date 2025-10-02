import secrets from "../../secrets.json" with { type: "json" };
import { DOMParser } from "xmldom";

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
export const autocomplete = async (query) => {
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
export const post = async (query) => {
	const timeLabel = {
		total:  "    FETCH total      ",
		json:   "    FETCH Rule34 JSON",
		others: "    FETCH Rule34 XML+"
	};

	console.time(timeLabel.total);

	console.time(timeLabel.json);
	const initial = await fetch(url.post({
		json: true, tags: true, query: query
	})).then(e => e.json()).catch(() => false);
	console.timeEnd(timeLabel.json);

	if (!initial) return null;

	console.time(timeLabel.others);
	const api = await Promise.all([
		fetch(url.post({
			limit: 1000, json: true, query: `parent:${initial[0].id}`
		})),
		fetch(url.post({
			json: false, query: query
		})),
		fetch(url.comment({
			id: initial[0].id
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
	console.timeEnd(timeLabel.others);

	console.timeEnd(timeLabel.total);

	const data = formatData.main(api, { children: true, tags: true, comments: true });

	return data;
};

export const search = async (query, options) => {
	const timeLabel = {
		total:  "    FETCH total      ",
		json:   "    FETCH Rule34 JSON",
		others: "    FETCH Rule34 XML+"
	};

	console.time(timeLabel.total);

	console.time(timeLabel.json);
	const initial = await fetch(url.post({
		json: true, tags: false, limit: options?.limit ?? 50, query: query
	})).then(e => e.json()).catch(() => false);
	console.timeEnd(timeLabel.json);

	if (!initial) return null;

	console.time(timeLabel.others);
	const api = await Promise.all([
		fetch(url.post({
			json: false, limit: options?.limit ?? 50, query: query
		}))
	]).then(async array => ({
		json: initial,
		xml: await array[0].text().then(e => new DOMParser().parseFromString(e, "text/xml")).then(e => ({
			posts: e.firstChild,
			post: e.getElementsByTagName("post")
		})),
	}));
	console.timeEnd(timeLabel.others);

	console.timeEnd(timeLabel.total);

	const data = formatData.multiple(api);

	return data;
};

const url = {
	post: (options) => {
		return "https://api.rule34.xxx/?" + new URLSearchParams({
			page: "dapi",
			s: "post",
			q: "index",
			limit: String(options?.limit ?? 1),
			json: String(Number(options?.json ?? false)),
			fields: options?.tags ? "tag_info" : "",
			tags: options?.query ?? "",
			api_key: secrets.rule34.api_key,
			user_id: secrets.rule34.user_id
		}).toString();
	},
	comment: (options) => {
		return "https://api.rule34.xxx/?" + new URLSearchParams({
			page: "dapi",
			s: "comment",
			q: "index",
			post_id: options?.id,
			api_key: secrets.rule34.api_key,
			user_id: secrets.rule34.user_id
		}).toString();
	}
}

const formatData = {
	main: (api, config) => {
		const data = {
			image: {
				main: {
					url: api.json[0].file_url,
					width: api.json[0].width,
					height: api.json[0].height
				},
				sample: {
					url: api.json[0].sample_url,
					width: api.json[0].sample_width,
					height: api.json[0].sample_height,
					necessary: api.json[0].sample
				},
				thumbnail: {
					url: api.json[0].preview_url,
					width: Number(api.xml.post.getAttribute("preview_width")),
					height: Number(api.xml.post.getAttribute("preview_height"))
				},
				directory: api.json[0].directory,
				name: api.json[0].image,
				hash: api.json[0].hash,
				extension: api.json[0].image.split(".").pop()
			},
			id: api.json[0].id,
			created: dateObject(new Date(api.xml.post.getAttribute("created_at"))),
			updated: dateObject(new Date(api.json[0].change * 1000)),
			creator: {
				name: api.json[0].owner,
				id: Number(api.xml.post.getAttribute("creator_id"))
			},
			rating: api.json[0].rating,
			score: api.json[0].score,
			status: api.json[0].status,
			notes: api.json[0].has_notes, // TODO: find out how to fetch note info
			parent: api.json[0].parent_id,
			children: config.children
				? api.children.filter(e => e.id !== api.json[0].id).map(e => e.id)
				: api.xml.post.getAttribute("has_children") === "true",
			source: api.json[0].source || null
		};

		if (config.tags) data.tags = {
			string: api.json[0].tags,
			array: api.json[0].tag_info
				.map(e => ({ name: e.tag, count: e.count, type: e.type })),
			category: {
				Copyright: api.json[0].tag_info
					.filter(e => e.type === "copyright")
					.map(e => ({ name: e.tag, count: e.count })),
				Character: api.json[0].tag_info
					.filter(e => e.type === "character")
					.map(e => ({ name: e.tag, count: e.count })),
				Artist: api.json[0].tag_info
					.filter(e => e.type === "artist")
					.map(e => ({ name: e.tag, count: e.count })),
				General: api.json[0].tag_info
					.filter(e => e.type === "tag")
					.map(e => ({ name: e.tag, count: e.count })),
				Metadata: api.json[0].tag_info
					.filter(e => e.type === "metadata")
					.map(e => ({ name: e.tag, count: e.count })),
				null: api.json[0].tag_info
					.filter(e => e.type === null)
					.map(e => ({ name: e.tag, count: e.count })),
				Other: api.json[0].tag_info
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
	},
	multiple: (api, config) => {
		const data = [];
		for (const index in api.json) {
			const post = {
				image: {
					main: {
						url: api.json[index].file_url,
						width: api.json[index].width,
						height: api.json[index].height
					},
					sample: {
						url: api.json[index].sample_url,
						width: api.json[index].sample_width,
						height: api.json[index].sample_height,
						necessary: api.json[index].sample
					},
					thumbnail: {
						url: api.json[index].preview_url,
						width: Number(api.xml.post[index].getAttribute("preview_width")),
						height: Number(api.xml.post[index].getAttribute("preview_height"))
					},
					directory: api.json[index].directory,
					name: api.json[index].image,
					hash: api.json[index].hash,
					extension: api.json[index].image.split(".").pop()
				},
				id: api.json[0].id,
				created: dateObject(new Date(api.xml.post[index].getAttribute("created_at"))),
				updated: dateObject(new Date(api.json[index].change * 1000)),
				creator: {
					name: api.json[index].owner,
					id: Number(api.xml.post[index].getAttribute("creator_id"))
				},
				rating: api.json[index].rating,
				score: api.json[index].score,
				status: api.json[index].status,
				notes: api.json[index].has_notes,
				parent: api.json[index].parent_id,
				children: api.xml.post[index].getAttribute("has_children") === "true",
				source: api.json[index].source || null
			};

			data.push(post);
		}

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