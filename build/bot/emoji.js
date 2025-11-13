import * as Discord from "discord.js";
import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import Sharp from "sharp";
import { discord as secret } from "#secret";

const client = new Discord.Client();

client.once(Discord.Events.ClientReady, async client => {
    const manager = client.application.emojis;

    manager.fetch()
        .then(emojis => Promise.all(emojis.map(emoji => emoji.delete())))
        .then(promises => console.log(`Deleted ${promises.length} emoji`));

    const json = {};
    const path = Path.resolve("res/emoji");
    await FileSystem.readdir(path, { recursive: true })
    .then(files => Promise.all(files.map(async file => {
        // TODO: see if Sharp instance methods modify the instance
        const original = new Sharp(Path.join(path, file));
        const { height } = await image.metadata();
        const resize = await original.resize({
            height: Math.ceil(128 / height) * height,
            kernel: "nearest"
        }).toBuffer();

        const { name } = Path.parse(file);
        if (!name.match(/\.spr$/)) {
            const emoji = await manager.create({
                attachment: resize,
                name: name
            }).then(emoji => emoji.toString());
            json[name] = emoji;
        } else {
            const original = new Sharp(resize);
            const { width, height } = await original.metadata();
            const slices = Array(width / height).keys().map(num => num * height);
        }
    }))).then(promises => console.log(`Uploaded ${promises.length} emoji`));

    FileSystem.writeFile("bin/emoji.json", JSON.stringify(json, null, "\t"))
        .then(() => console.log("file://bin/emoji.json updated"));
    client.destroy();
});

client.login(secret.token);