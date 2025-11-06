import secret from "#/secret.json" with { type: "json" };

export const bot = {
    token: secret.discord.token,
    guildId: String(secret.discord.admin_server)
};

export const channel = {
    testing: { id: String(secret.discord.channel.testing) },
    forum: {
        id: String(secret.discord.channel.forum),
        tags: {

        }
    },
    save: { id: String(secret.discord.channel.save) },
    pack: { id: String(secret.discord.channel.pack) },
    hunt: { id: String(secret.discord.channel.hunt) },
    tour: { id: String(secret.discord.channel.tour) },
    hold: { id: String(secret.discord.channel.hold) }
};

export const user = {
    main: String(secret.discord.user.main)
};