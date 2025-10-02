import * as Discord from "discord.js";
import fetch from "node-fetch";
import FormData from "form-data";
import embed from "../../embed.js";
import secret from "#root/secret.json" with { type: "json" };

export async function ButtonInteraction(i) {
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");

	const modal = embed.comments.post(id);

	await i.showModal(modal);
}

export async function ModalSubmitInteraction(i) {
	await i.deferReply();
	
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const content = i.fields.getTextInputValue("content");

	if (content.split(" ").length < 3) {
		i.editReply({ components: [{
			type: Discord.ComponentType.Container,
			accent_color: 0xE9263D,
			components: [
				{
					type: Discord.ComponentType.TextDisplay,
					content: "### Your content has to have at least 3 words!"
				},
				{
					type: Discord.ComponentType.TextDisplay,
					content: "Give 'keystrokes keystrokes' a shot."
				}
			]
		}]});
		return;
	}

	const form = new FormData();
	form.append("comment", content);
	form.append("submit", "Post comment");
	form.append("conf", "2");

	const response = await fetch(`https://rule34.xxx/?page=comment&s=save&id=${id}`, {
		method: "POST",
		body: form,
		headers: {
			"Cookie": `user_id=${secret.rule34.user_id}; pass_hash=${secret.rule34.pass_hash}`,
			"Origin": "https://rule34.xxx",
			"Referer": `https://rule34.xxx/?page=post&s=view&id=${id}`,
			"User-Agent": secret.UserAgent
		}
	});

	if (!response.ok) {
		i.editReply({ components: [{
			type: Discord.ComponentType.Container,
			components: [
				{
					type: Discord.ComponentType.TextDisplay,
					content: "There was a bad response from Rule34!"
				},
				{
					type: Discord.ComponentType.TextDisplay,
					content: "Response data:\n```json\n" + JSON.stringify(response, null, 4) + "\n```"
				}
			]
		}]});
		return;
	}

	i.editReply(`Comment posted!\n>>> ${content}`);
}