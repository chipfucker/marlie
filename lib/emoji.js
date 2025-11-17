import file from "#bin/emoji.json" with { type: "json" };

export { get as unicode } from "node-emoji";

class SplitEmoji extends Array {
    constructor(array) {
        super(array);
    }

    toString() {
        return this.join("");
    }
}

for (const [name, value] of file.entries()) {
    
}