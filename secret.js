import secret from "#root/secret.json" with { type: "json" };

export const userAgent = secret.UserAgent;

export const bot = {
    token: secret.discord.token,
    clientId: secret.discord.app_id,
    guildId: secret.discord.admin_server
};

export const user = {
    main: secret.discord.user.main
};

export const channel = {
    testing: { id: secret.discord.channel.testing },
    announcements: { id: secret.discord.channel.announcements },
    main: { id: secret.discord.channel.main },
    nsfw: { id: secret.discord.channel.nsfw },
    knit: {
        id: secret.discord.channel.knit,
        tag: {
            test: secret.discord.channel.knit_tags.TEST,
            sampling: secret.discord.channel.knit_tags.Sampling,
            tour: secret.discord.channel.knit_tags.Tour,
            exhausted: secret.discord.channel.knit_tags.Exhausted,
            goated: secret.discord.channel.knit_tags.Goated,
            mediocre: secret.discord.channel.knit_tags.Mediocre,
            bad: secret.discord.channel.knit_tags.Bad,
            withGoodTags: secret.discord.channel.knit_tags["...with good tags"],
        }
    },
    hunting: {
        id: secret.discord.channel.hunt_forum,
        tag: {
            found: secret.discord.channel.hunt_forum_tags.Found,
            hunting: secret.discord.channel.hunt_forum_tags.Hunting,
            lost: secret.discord.channel.hunt_forum_tags.Lost
        }
    },
    save: { id: secret.discord.channel.save },
    pack: { id: secret.discord.channel.pack },
    hunt: { id: secret.discord.channel.hunt },
    tour: { id: secret.discord.channel.tour },
    bide: { id: secret.discord.channel.bide }
};

export const rule34 = {
    api_key: secret.rule34.api_key,
    user_id: secret.rule34.user_id,
    pass_hash: secret.rule34.pass_hash
};