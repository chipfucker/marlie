export function getFromParams(input) {
    const links = input.split(/\s+/);
    if (!links.every(item => URL.canParse(item)))
        return input;
    else
        return links.join("\n");
}

export function getFromContent(message) {
    if (message.author.username === "Lawliet") {
        const regex = /\[Source\]\(<(.+?)>\)/g;
        const match = message.content.match(regex)
            ?.map(item => item.replace(regex, "$1"));
        return match;
    } else {
        const match = message.content.match(/(?:http|https):\/\/(?:\S*)/ig);
        return match;
    }
}

export async function send({ client, id, content }) {
    const promise = client.channels.fetch(id)
    .then(async channel => channel.send({ content:
        content instanceof Array ? content.join("\n")
        : content
    }))
    .then(async message => `Sent! ${message.url}`);

    return promise;
}