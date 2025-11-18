import secret from "#root/secret.json" with { type: "json" };

export const userAgent = secret.UserAgent;

export const bot = {
    token: secret.discord.token,
    clientId: secret.discord.client_id,
    guildId: secret.discord.admin_server
};

export const user = {
    main: secret.discord.user.main
};

export const channel = {
    testing: {
        id: secret.discord.channel.testing.id,
        emoji: secret.discord.channel.testing.emoji
    },
    announcements: {
        id: secret.discord.channel.announcements.id,
        emoji: secret.discord.channel.announcements.emoji
    },
    main: {
        id: secret.discord.channel.main.id,
        emoji: secret.discord.channel.main.emoji
    },
    nsfw: {
        id: secret.discord.channel.nsfw.id,
        emoji: secret.discord.channel.nsfw.emoji
    },
    knit: {
        id: secret.discord.channel.knit.id,
        emoji: secret.discord.channel.knit.emoji,
        tag: {
            test: secret.discord.channel.knit.tags.TEST,
            sampling: secret.discord.channel.knit.tags.Sampling,
            tour: secret.discord.channel.knit.tags.Tour,
            exhausted: secret.discord.channel.knit.tags.Exhausted,
            goated: secret.discord.channel.knit.tags.Goated,
            mediocre: secret.discord.channel.knit.tags.Mediocre,
            bad: secret.discord.channel.knit.tags.Bad,
            withGoodTags: secret.discord.channel.knit.tags["...with good tags"],
        }
    },
    hunting: {
        id: secret.discord.channel.hunt_forum.id,
        emoji: secret.discord.channel.hunt_forum.emoji,
        tag: {
            found: secret.discord.channel.hunt_forum.tags.Found,
            hunting: secret.discord.channel.hunt_forum.tags.Hunting,
            lost: secret.discord.channel.hunt_forum.tags.Lost
        }
    },
    save: {
        id: secret.discord.channel.save.id,
        emoji: secret.discord.channel.save.emoji
    },
    pack: {
        id: secret.discord.channel.pack.id,
        emoji: secret.discord.channel.pack.emoji
    },
    hunt: {
        id: secret.discord.channel.hunt.id,
        emoji: secret.discord.channel.hunt.emoji
    },
    tour: {
        id: secret.discord.channel.tour.id,
        emoji: secret.discord.channel.tour.emoji
    },
    bide: {
        id: secret.discord.channel.bide.id,
        emoji: secret.discord.channel.bide.emoji
    }
};

export const rule34 = {
    api_key: secret.rule34.api_key,
    user_id: secret.rule34.user_id,
    pass_hash: secret.rule34.pass_hash
};