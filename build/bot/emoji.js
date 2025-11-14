import * as Discord from "discord.js";
import * as FileSystem from "node:fs/promises";
import * as Path from "node:path";
import Sharp from "sharp";
import { bot as secret } from "#secret";

const client = new Discord.Client({ intents: [] });

client.once(Discord.Events.ClientReady, async client => {
    await client.application.emojis.fetch()
        .then(emojis => Promise.all(emojis.map(emoji => emoji.delete())))
        .then(promises => console.log(`Deleted ${promises.length} emoji`));

    const json = {};
    const path = Path.resolve("res/emoji");

    await FileSystem.readdir(path, { recursive: true })
    .then(files => Promise.all(files.map(async file => {
        const { name, ext } = Path.parse(file);
        console.log()

        switch (ext) {
            case "":
                return false;
            case ".png": {
                // TODO: see if Sharp instance methods modify the instance
                const original = new Sharp(Path.join(path, file));
                const { height } = await original.metadata();
                const image = await original.resize({
                    height: Math.ceil(128 / height) * height,
                    kernel: "nearest"
                }).toBuffer();
                if (!name.match(/\.spr$/)) {
                    const emoji = await client.application.emojis.create({
                        attachment: image,
                        name: name
                    }).then(emoji => emoji.toString());
                    json[name] = emoji;
                } else {
                    const original = new Sharp(image);
                    const { width, height } = await original.metadata();
                    const slices = Array(width / height).keys().map(num => num * height);
                    json[name] = [];
                    for (const index in slices) {
                        const original = new Sharp(image);
                        const attachment = await original.extract({
                            top: 0,
                            left: slices[index],
                            width: height,
                            height
                        }).toBuffer();
                        
                        client.application.emojis.create({ attachment, name: name + index })
                            .then(emoji => emoji.toString())
                            .then(emoji => json[name].push(emoji));
                    }
                }
            } return true;
            case ".svg": {
                const image = await new Sharp(Path.join(path, file)).toBuffer();
                if (!name.match(/\.spr$/)) {
                    const emoji = await client.application.emojis.create({
                        attachment: image,
                        name: name
                    }).then(emoji => emoji.toString());
                    json[name] = emoji;
                } else {
                    const original = new Sharp(image);
                    const { width, height } = await original.metadata();
                    const slices = Array(width / height).keys().map(num => num * height);
                    json[name] = [];
                    for (const index in slices) {
                        const original = new Sharp(image);
                        const attachment = await original.extract({
                            top: 0,
                            left: slices[index],
                            width: height,
                            height
                        }).toBuffer();
                        
                        client.application.emojis.create({ attachment, name: name + index })
                            .then(emoji => emoji.toString())
                            .then(emoji => json[name].push(emoji));
                    }
                }
            } return true;
        }
    })))
        .then(pro => console.log(`Uploaded ${pro.filter(p=>p).length} emoji`));

    FileSystem.writeFile("bin/emoji.json", JSON.stringify(json, null, "\t"))
        .then(() => console.log("file://./bin/emoji.json updated"));
    client.destroy();
});

client.login(secret.token);