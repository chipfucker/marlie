import secret from "#root/secret.json" with { type: "json" };

export const userAgent = secret.UserAgent;

export const bot = {
    token: secret.discord.token,
    clientId: String(secret.discord.app_id),
    guildId: String(secret.discord.admin_server)
};

export const user = {
    main: String(secret.discord.user.main)
};

export const channel = {
    testing: { id: String(secret.discord.channel.testing) },
    announcements: { id: String(secret.discord.channel.announcements) },
    main: { id: String(secret.discord.channel.main) },
    nsfw: { id: String(secret.discord.channel.nsfw) },
    knit: {
        id: String(secret.discord.channel.knit),
        tag: {
            test: String(secret.discord.channel.knit_tags.TEST),
            sampling: String(secret.discord.channel.knit_tags.Sampling),
            tour: String(secret.discord.channel.knit_tags.Tour),
            exhausted: String(secret.discord.channel.knit_tags.Exhausted),
            goated: String(secret.discord.channel.knit_tags.Goated),
            mediocre: String(secret.discord.channel.knit_tags.Mediocre),
            bad: String(secret.discord.channel.knit_tags.Bad),
            withGoodTags: String(secret.discord.channel.knit_tags["...with good tags"]),
        }
    },
    hunting: {
        id: String(secret.discord.channel.hunt_forum),
        tag: {
            found: String(secret.discord.channel.hunt_forum_tags.Found),
            hunting: String(secret.discord.channel.hunt_forum_tags.Hunting),
            lost: String(secret.discord.channel.hunt_forum_tags.Lost)
        }
    },
    save: { id: String(secret.discord.channel.save) },
    pack: { id: String(secret.discord.channel.pack) },
    hunt: { id: String(secret.discord.channel.hunt) },
    tour: { id: String(secret.discord.channel.tour) },
    bide: { id: String(secret.discord.channel.bide) }
};

export const rule34 = {
    api_key: secret.rule34.api_key,
    user_id: String(secret.rule34.user_id),
    pass_hash: secret.rule34.pass_hash
};