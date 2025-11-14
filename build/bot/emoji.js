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
        const { name: filename, ext: extension } = Path.parse(file);

        switch (extension) {
            case "":
                break;
            case ".png": {
                // TODO: see if Sharp instance methods modify the instance
                const original = new Sharp(Path.join(path, file));
                const { height } = await original.metadata();
                const image = await original.resize({
                    height: Math.ceil(128 / height) * height,
                    kernel: "nearest"
                }).toBuffer();

                await handleBuffer(filename, image);
            } break;
            case ".svg": {
                const image = await new Sharp(Path.join(path, file)).toBuffer();
                
                await handleBuffer(filename, image);
            } break;
        }

        async function handleBuffer(filename, image) {
            if (filename.match(/\.spr$/)) {
                const name = filename.replace(/\.spr$/, "");
                const original = new Sharp(image);
                const { width, height } = await original.metadata();
                const slices = Array(width / height).keys().map(num => num * height).toArray();
                json[name] = [];
                for (const index in slices) {
                    const original = new Sharp(image);
                    const extract = await original.extract({
                        top: 0,
                        left: slices[index],
                        width: height,
                        height: height
                    }).toBuffer();

                    client.application.emojis.create({
                        attachment: extract,
                        name: name.replace(/\W/g, "") + index
                    })
                        .then(emoji => json[name].push(emoji.toString()));
                }
            } else {
                const name = filename;
                const emoji = await client.application.emojis.create({
                    attachment: image,
                    name: name.replace(/\W/g, "")
                }).then(emoji => emoji.toString());
                json[filename] = emoji;
            }
        }
    })))
    .then(async () => {
        const size = await client.application.emojis.fetch().then(emojis => emojis.size);
        console.log(`Uploaded ${size} emoji`);
    });

    const jsonPath = Path.resolve("bin/emoji.json");

    FileSystem.writeFile(jsonPath, JSON.stringify(json, null, "\t"))
        .then(() => console.log("build/emoji.json updated"));
    client.destroy();
});

client.login(secret.token);