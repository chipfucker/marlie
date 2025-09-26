const Discord = require("discord.js");
const { rule34 } = require("../../../../utility/api.js");
const embed = require("../../../../utility/embed.js");

module.exports = (i) => {
	i.deferUpdate();
	const id = i.message.components[0].components[0].components[1].content.replace(/## (\d+)/, "$1");
	const data = await rule34.post("id:" + id);
	const components = i.message.components[0].components;
	for (const component in components) {
		
	}
};