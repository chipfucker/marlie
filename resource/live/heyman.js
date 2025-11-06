({
	flags: Discord.MessageFlags.IsComponentsV2,
	content: "",
	files: [],
	embeds: [],
	components: [{ type: Discord.ComponentType.Container, components: [
		{ type: Discord.ComponentType.TextDisplay, content: "# Carrier pidgeon payment sent" },
		{ type: Discord.ComponentType.TextDisplay, content: "<@1184619891215573042> has sent a payment of :dollar: **$4** to <@1050240278671413250>." },
		{ type: Discord.ComponentType.TextDisplay, content: "Payment will be processed as soon as the recipient accepts it, or aborted if declined." },
		{ type: Discord.ComponentType.ActionRow, components: [{
			type: Discord.ComponentType.Button,
			label: "Accept payment",
			style: 5,
			url: "https://troll.com/"
		}]}
	]}]
})