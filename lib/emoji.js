import file from "#build/emoji.json" with { type: "json" };
import { get } from "node-emoji";

export let unicode = get;

class emoji {
    constructor() {
    }
}