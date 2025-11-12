export function getFromParams(input) {
    const links = input.split(/\s+/);
    return links.every(item => URL.canParse(item))
        ? links.join("\n")
        : input;
}

export function getFromContent(message) {
    if (message.author.username === "Lawliet") {
        const regex = /\[Source\]\(<(.+?)>\)/g;
        const match = message.content.match(regex)
            ?.map(item => item.replace(regex, "$1"));
        if (match) return match.join("\n");
        else return null;
    } else {
        const match = message.content.match(/(?:http|https):\/\/(?:\S*)/ig);
        if (match) return match.join("\n");
        else return null;
    }
}

export async function send({ client, id, content }) {
    const promise = client.channels.fetch(id)
        .then(channel => channel.send({ content }))
        .then(message => `Sent! ${message.url}`);

    return promise;
}